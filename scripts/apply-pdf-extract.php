<?php
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
