"""
Extract title, teaser and up to 2 images from Ressources PDFs,
then update Laravel recherches (+ vulgarisations) for local front tests.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

import fitz

ROOT = Path(r"c:\Users\Léandre\Desktop\MIAW\Projet SAE 501")
RESSOURCES = ROOT / "Ressources"
BACKEND = ROOT / "backend"
COVERS_DIR = BACKEND / "public" / "files" / "recherches" / "covers"
OUT_JSON = ROOT / "scripts" / "pdf-extract-test-data.json"
PHP_APPLY = ROOT / "scripts" / "apply-pdf-extract.php"

MIN_IMG_SIDE = 120
MAX_IMG_BYTES = 2_500_000
TEASER_MAX = 380

# Titres / accroches nettoyés pour les tests (basés sur le contenu extrait).
OVERRIDES: dict[str, dict[str, str]] = {
    "C'Nature_JFG_2026-07-07_protected.pdf": {
        "titre": "Impact du changement climatique sur la croissance économique",
        "accroche": (
            "Conférence C’Nature — quel est l’impact du changement climatique sur la "
            "croissance économique ? Intervention de Jean-François Gajewski "
            "(UNC – LARJE / IAE), autour de l’habitabilité et de ses effets économiques."
        ),
    },
    "C'nature_Nazha SELMAOUI-Roman THIBEAUX_2026-05-05.pdf": {
        "titre": "Comprendre et prévoir la leptospirose",
        "accroche": (
            "Modélisation du risque fondée sur les données environnementales, "
            "avec Roman Thibeaux, Pierre Genthon, Cyrille Goarant, Rodrigue Govan "
            "et Nazha Selmaoui — pour anticiper la leptospirose en Nouvelle-Calédonie."
        ),
    },
    "Synthèse TOPOS_Dotte-Wacalie_V2.pdf": {
        "titre": "Promotion et revitalisation des langues en Nouvelle-Calédonie",
        "accroche": (
            "Les langues sont plus qu’un outil de communication : un enjeu pour "
            "maintenir l’héritage culturel kanak, au cœur du projet TOPOS."
        ),
    },
    "Synthèse TOPOS_Dumas P_V1.pdf": {
        "titre": "TOPOS : une ville à l’écoute de ses synergies",
        "accroche": (
            "Un projet au cœur de Nouméa pour une ville à l’écoute de ses synergies "
            "biologiques et culturelles, porté par le Dr Pascal Dumas."
        ),
    },
    "Synthèse TOPOS_Hnawia_V1.pdf": {
        "titre": "Bien-être kanak : individu, société, environnement",
        "accroche": (
            "Les trois piliers du bien-être chez les Kanak, et le rôle de la petite "
            "médecine face aux déséquilibres du quotidien — synthèse TOPOS."
        ),
    },
    "Synthèse TOPOS_Marchand_V2.pdf": {
        "titre": "Mangroves urbaines sous pression",
        "accroche": (
            "Malgré leurs services écosystémiques, les mangroves — surtout urbaines — "
            "subissent de fortes pressions anthropiques. Synthèse TOPOS sur leur "
            "distribution géographique et les enjeux de préservation."
        ),
    },
    "V2 Modèle fiche synthèse - Fiche 1.pdf": {
        "titre": "Surpoids et obésité chez les enfants du Pacifique",
        "accroche": (
            "Quelle est la prévalence du surpoids et de l’obésité chez les enfants "
            "de 6 à 12 ans dans la région du Pacifique, et quelles en sont les "
            "principales causes ?"
        ),
    },
    "BONC_Diaporama PDF.pdf": {
        "titre": "BONC : réduire le chrome hexavalent dans les cours d’eau",
        "accroche": (
            "Plus de la moitié des échantillons d’eaux brutes analysés dépassent le "
            "seuil autorisé. Le projet BONC explore une solution fondée sur la nature "
            "pour réduire le Cr(VI)."
        ),
    },
    "CESO_DiversitÉS_Thème 1_V1.pdf": {
        "titre": "CESO DiversitÉS — thème 1",
        "accroche": (
            "Résumé du projet DiversitÉS (CESO) : données-clés et apports pour "
            "comprendre la diversité, réalisation Direction Science & Société UNC."
        ),
    },
    "FUEL_Diaporama PDF.pdf": {
        "titre": "FUEL : pollution atmosphérique et incendies",
        "accroche": (
            "Porté par le Dr Sarah Robin, le projet FUEL analyse les particules fines "
            "et polluants gazeux durant les périodes d’incendies, et leurs "
            "conséquences pour le vivant."
        ),
    },
    "Fiche-Projet_BONC_V1.pdf": {
        "titre": "Fiche projet BONC",
        "accroche": (
            "Réduire la charge en Cr(VI) des cours d’eau sous le seuil acceptable pour "
            "la consommation humaine (6 µg/L), via une solution fondée sur la nature."
        ),
    },
    "Fiche-Projet_DECHRO_V1.pdf": {
        "titre": "Fiche projet DECHRO",
        "accroche": (
            "Étudier des solutions écologiques et peu coûteuses pour limiter les "
            "risques sanitaires liés aux pollutions — bénéfices pour la société, "
            "constat et chiffres-clés."
        ),
    },
    "Fiche-Projet_FUEL_V1.pdf": {
        "titre": "Fiche projet FUEL",
        "accroche": (
            "Collecte et analyse des mesures atmosphériques (PM10, PM2,5, métaux, "
            "NOx, SO₂, O₃) sur les stations Scal’Air durant les périodes d’incendies."
        ),
    },
    "MATRRISS_Diaporama long.pdf": {
        "titre": "MATRRISS : dépollution des sols polymétalliques",
        "accroche": (
            "Les pollutions sont souvent polymétalliques, ce qui rend la dépollution "
            "complexe. MATRRISS explore des approches pour y répondre."
        ),
    },
    "Projet SPIRAL_WP3-4_R THIBEAUX-N SELMAOUI.pdf": {
        "titre": "SPIRAL — l’IA au service de la santé publique",
        "accroche": (
            "Transfert des résultats de la recherche en modélisation et cartographie "
            "du risque de leptospirose en Nouvelle-Calédonie (volets 3-4 du projet SPIRAL)."
        ),
    },
    "Synthèse TOPOS V5.pdf": {
        "titre": "Synthèse TOPOS — nature en ville",
        "accroche": (
            "Le projet interroge les interactions entre les citadins et leur "
            "environnement : perceptions et pratiques liées aux formes de nature en ville."
        ),
    },
}


def ascii_fold(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    return text


def slugify(text: str) -> str:
    text = ascii_fold(text).lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")[:90]


def normalize_ws(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def page_text(doc: fitz.Document, max_pages: int = 2) -> str:
    parts: list[str] = []
    for i, page in enumerate(doc):
        if i >= max_pages:
            break
        parts.append(page.get_text("text"))
    return normalize_ws("\n".join(parts))


def guess_title(filename: str, meta_title: str, text: str) -> str:
    override = OVERRIDES.get(filename)
    if override:
        return override["titre"]

    meta = (meta_title or "").strip()
    bad = {"", "présentation powerpoint", "presentation powerpoint"}
    if meta.lower() not in bad and len(meta) > 20:
        return re.sub(r"\s+", " ", meta)[:180]

    lines = [ln.strip(" •\-–—\t ") for ln in text.splitlines() if ln.strip()]
    candidates = [ln for ln in lines if 24 <= len(ln) <= 140]
    for ln in candidates[:15]:
        low = ln.lower()
        if low.startswith(("objectif", "constat", "contexte", "étape", "fig ", "figure")):
            continue
        return ln[:180]
    return Path(filename).stem.replace("_", " ")[:180]


def make_teaser(filename: str, text: str, title: str) -> str:
    override = OVERRIDES.get(filename)
    if override:
        return override["accroche"]

    if not text:
        return f"{title}. Résumé détaillé bientôt disponible — document source consultable en PDF."

    body = re.sub(r"\s+", " ", text).strip()
    if len(body) <= TEASER_MAX:
        return body
    cut = body[:TEASER_MAX]
    m = list(re.finditer(r"[.!?…](\s|$)", cut))
    if m and m[-1].end() > 140:
        return cut[: m[-1].end()].strip()
    sp = cut.rfind(" ")
    return (cut[:sp] if sp > 140 else cut).rstrip(",;:") + "…"


def extract_images(doc: fitz.Document, dest_prefix: Path, max_images: int = 2) -> list[str]:
    saved: list[str] = []
    seen: set[int] = set()

    for page_index, page in enumerate(doc):
        if page_index > 3 or len(saved) >= max_images:
            break
        for img in page.get_images(full=True):
            xref = img[0]
            if xref in seen:
                continue
            seen.add(xref)
            try:
                pix = fitz.Pixmap(doc, xref)
            except Exception:
                continue
            if pix.n >= 5:
                pix = fitz.Pixmap(fitz.csRGB, pix)
            if pix.width < MIN_IMG_SIDE or pix.height < MIN_IMG_SIDE:
                continue
            ratio = pix.width / max(pix.height, 1)
            if ratio > 8 or ratio < 0.12:
                continue
            out = dest_prefix.parent / f"{dest_prefix.name}-{len(saved) + 1}.jpg"
            try:
                if pix.alpha:
                    pix = fitz.Pixmap(pix, 0)
                pix.save(out.as_posix(), jpg_quality=82)
            except Exception:
                continue
            if out.stat().st_size > MAX_IMG_BYTES:
                out.unlink(missing_ok=True)
                continue
            saved.append(f"recherches/covers/{out.name}")
            if len(saved) >= max_images:
                break

    if not saved and len(doc) > 0:
        pix = doc[0].get_pixmap(matrix=fitz.Matrix(1.4, 1.4), alpha=False)
        out = dest_prefix.parent / f"{dest_prefix.name}-1.jpg"
        pix.save(out.as_posix(), jpg_quality=80)
        saved.append(f"recherches/covers/{out.name}")

    return saved


def match_key(filename: str) -> str:
    """Stable key used both for cover filenames and DB matching."""
    return slugify(Path(filename).stem)


def main() -> int:
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    pdfs = sorted(RESSOURCES.rglob("*.pdf"))
    if not pdfs:
        print("No PDFs found", file=sys.stderr)
        return 1

    results = []
    for pdf in pdfs:
        doc = fitz.open(pdf)
        meta = doc.metadata or {}
        text = page_text(doc, 2)
        title = guess_title(pdf.name, meta.get("title") or "", text)
        teaser = make_teaser(pdf.name, text, title)
        key = match_key(pdf.name)
        covers = extract_images(doc, COVERS_DIR / key, max_images=2)
        doc.close()

        item = {
            "source_pdf": str(pdf.relative_to(ROOT)).replace("\\", "/"),
            "filename": pdf.name,
            "match_key": key,
            "titre": title,
            "accroche": teaser,
            "covers": covers,
        }
        results.append(item)
        print(f"OK  {pdf.name}")
        print(f"    titre: {title}")
        print(f"    accroche: {teaser[:110]}…")
        print(f"    covers: {covers}")

    OUT_JSON.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nWrote {OUT_JSON}")

    PHP_APPLY.write_text(
        r"""<?php
declare(strict_types=1);

$backendRoot = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'backend';
require $backendRoot . '/vendor/autoload.php';
$app = require $backendRoot . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Recherche;
use App\Models\Vulgarisation;

$jsonPath = dirname(__DIR__) . '/scripts/pdf-extract-test-data.json';
$items = json_decode(file_get_contents($jsonPath), true, 512, JSON_THROW_ON_ERROR);

function fold(string $s): string {
    $map = [
        'à'=>'a','á'=>'a','â'=>'a','ä'=>'a','ã'=>'a',
        'è'=>'e','é'=>'e','ê'=>'e','ë'=>'e',
        'ì'=>'i','í'=>'i','î'=>'i','ï'=>'i',
        'ò'=>'o','ó'=>'o','ô'=>'o','ö'=>'o','õ'=>'o',
        'ù'=>'u','ú'=>'u','û'=>'u','ü'=>'u',
        'ç'=>'c','ñ'=>'n','œ'=>'oe','æ'=>'ae',
        '’'=>"'",'‘'=>"'",
    ];
    $s = strtr(mb_strtolower($s), $map);
    $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? $s;
    return trim($s, '-');
}

$skipTokens = ['pdf', 'v1', 'v2', 'v4', 'v5', 'long', 'theme', 'protected'];
$recherches = Recherche::query()->whereNotNull('pdf_path')->get();
$usedIds = [];
$updated = 0;

foreach ($items as $item) {
    $key = $item['match_key'] ?? fold($item['filename']);
    $tokens = array_values(array_filter(
        explode('-', $key),
        fn ($t) => strlen($t) > 2 && !in_array($t, $skipTokens, true)
    ));

    $best = null;
    $bestScore = 0;
    foreach ($recherches as $r) {
        if (isset($usedIds[$r->id])) {
            continue;
        }
        $path = fold((string) $r->pdf_path);
        $score = 0;
        // Prefer contiguous token sequence present in path (e.g. fiche-projet-bonc)
        $joined = implode('-', $tokens);
        if ($joined !== '' && str_contains($path, $joined)) {
            $score = 100 + strlen($joined);
        } elseif ($key !== '' && str_contains($path, $key)) {
            $score = 90;
        } else {
            foreach ($tokens as $t) {
                if (str_contains($path, $t)) {
                    $score += 10;
                }
            }
            // Bonus if "diaporama" / "fiche-projet" family matches
            if (str_contains($key, 'diaporama') && str_contains($path, 'diaporama')) {
                $score += 25;
            }
            if (str_contains($key, 'fiche-projet') && str_contains($path, 'fiche-projet')) {
                $score += 25;
            }
        }
        if ($score > $bestScore) {
            $bestScore = $score;
            $best = $r;
        }
    }

    if (!$best || $bestScore < 20) {
        echo "MISS {$item['filename']} key={$key}\n";
        continue;
    }
    $usedIds[$best->id] = true;

    $covers = $item['covers'] ?? [];
    $coverUrls = array_map(fn ($c) => '/files/' . ltrim($c, '/'), $covers);
    $description = 'Test extract — covers: ' . implode(' | ', $coverUrls);

    $best->update([
        'titre' => $item['titre'],
        'abstract' => $item['accroche'],
        'description' => $description,
    ]);

    $vulga = Vulgarisation::query()->firstOrNew([
        'recherche_id' => $best->id,
        'niveau_public' => 'grand_public',
        'langue' => 'fr',
    ]);
    $vulga->titre = $item['titre'];
    $vulga->resume = $item['accroche'];
    $vulga->pdf_path = $best->pdf_path ?: ($covers[0] ?? 'recherches/missing.pdf');
    $vulga->save();

    echo "UPD id={$best->id} score={$bestScore} :: {$item['titre']}\n";
    $updated++;
}

echo "Updated {$updated}/" . count($items) . "\n";
""",
        encoding="utf-8",
    )

    proc = subprocess.run(["php", str(PHP_APPLY)], cwd=str(ROOT), check=False)
    # cleanup temp apply helper from previous run if any
    old = ROOT / "scripts" / "_apply-pdf-extract.php"
    if old.exists():
        old.unlink()
    return proc.returncode


if __name__ == "__main__":
    raise SystemExit(main())
