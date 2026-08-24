<?php

/**
 * Import one-shot : copie les PDF du dossier Ressources/ vers public/files/recherches/
 * et crée les enregistrements Recherche en base (SQLite locale).
 *
 * Usage : php scripts/import-ressources-pdfs.php
 */

declare(strict_types=1);

$backendRoot = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'backend';
$ressourcesRoot = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'Ressources';

if (!is_dir($backendRoot)) {
    fwrite(STDERR, "Backend introuvable : {$backendRoot}\n");
    exit(1);
}

if (!is_dir($ressourcesRoot)) {
    fwrite(STDERR, "Dossier Ressources introuvable : {$ressourcesRoot}\n");
    exit(1);
}

require $backendRoot . '/vendor/autoload.php';

$app = require $backendRoot . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Auteur;
use App\Models\Domaine;
use App\Models\Recherche;
use App\Models\User;
use Illuminate\Support\Str;

function collectPdfFiles(string $dir): array
{
    $files = [];
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS)
    );
    foreach ($iterator as $file) {
        if (!$file->isFile()) {
            continue;
        }
        if (strtolower($file->getExtension()) !== 'pdf') {
            continue;
        }
        $files[] = $file->getPathname();
    }
    sort($files);
    return $files;
}

function titleFromFilename(string $filename): string
{
    $name = pathinfo($filename, PATHINFO_FILENAME);
    $name = str_replace(['_', '-'], ' ', $name);
    $name = preg_replace('/\s+/', ' ', $name) ?? $name;
    return trim($name);
}

function domainForFolder(string $relativeFolder): array
{
    $folder = mb_strtolower($relativeFolder);

    if (str_contains($folder, "c'nature") || str_contains($folder, 'cnature')) {
        return ['code' => '1.biodiv', 'label' => 'Biodiversité, environnement, santé'];
    }
    if (str_contains($folder, 'synthèse') || str_contains($folder, 'synthese')) {
        return ['code' => '0.info', 'label' => 'Sciences de l\'information'];
    }
    if (str_contains($folder, 'projets')) {
        return ['code' => '2.geosci', 'label' => 'Géosciences'];
    }

    return ['code' => '0.info', 'label' => 'Sciences de l\'information'];
}

function guessAuthorFromTitle(string $title): ?string
{
    if (preg_match('/TOPOS[_\s]+([A-Za-zÀ-ÿ\- ]+)/u', $title, $m)) {
        return trim(preg_replace('/\s*V\d+$/u', '', $m[1]) ?? $m[1]);
    }
    if (preg_match('/([A-Z]{2,}),\s*([A-Za-zÀ-ÿ\- ]+)/u', $title, $m)) {
        return trim($m[1] . ' ' . $m[2]);
    }
    if (preg_match('/([A-Za-zÀ-ÿ\-]+)\s+([A-Z]{2,})/u', $title, $m)) {
        return trim($m[1] . ' ' . $m[2]);
    }

    return null;
}

$user = User::query()->first();
if (!$user) {
    fwrite(STDERR, "Aucun utilisateur en base — lancez d'abord les migrations/seed.\n");
    exit(1);
}

$destDir = public_path('files/recherches');
if (!is_dir($destDir) && !mkdir($destDir, 0755, true) && !is_dir($destDir)) {
    fwrite(STDERR, "Impossible de créer {$destDir}\n");
    exit(1);
}

$pdfs = collectPdfFiles($ressourcesRoot);
if ($pdfs === []) {
    fwrite(STDERR, "Aucun PDF trouvé dans Ressources/.\n");
    exit(1);
}

$imported = 0;
$skipped = 0;

foreach ($pdfs as $sourcePath) {
    $relativeFolder = trim(str_replace($ressourcesRoot, '', dirname($sourcePath)), DIRECTORY_SEPARATOR . '/\\');
    $originalName = basename($sourcePath);
    $titre = titleFromFilename($originalName);

    $existing = Recherche::query()->where('titre', $titre)->first();
    if ($existing && $existing->pdf_path && is_file(public_path('files/' . $existing->pdf_path))) {
        echo "SKIP (déjà importé) : {$titre}\n";
        $skipped++;
        continue;
    }

    $slug = Str::slug(pathinfo($originalName, PATHINFO_FILENAME));
    if ($slug === '') {
        $slug = 'document';
    }
    $destName = $slug . '-' . substr(md5($sourcePath), 0, 8) . '.pdf';
    $destPath = $destDir . DIRECTORY_SEPARATOR . $destName;

    if (!copy($sourcePath, $destPath)) {
        fwrite(STDERR, "Échec copie : {$sourcePath}\n");
        continue;
    }

    $pdfPath = 'recherches/' . $destName;
    $domainMeta = domainForFolder($relativeFolder);
    $domaine = Domaine::query()->firstOrCreate(
        ['code' => $domainMeta['code']],
        ['label' => $domainMeta['label']]
    );

    if ($existing) {
        $existing->update([
            'pdf_path' => $pdfPath,
            'description' => "Document importé depuis Ressources/{$relativeFolder}",
            'date_production' => $existing->date_production ?? '2026-01-01',
        ]);
        $recherche = $existing->fresh();
        echo "UPDATE : {$titre}\n";
    } else {
        $recherche = Recherche::query()->create([
            'user_id' => $user->id,
            'titre' => $titre,
            'description' => "Document importé depuis Ressources/{$relativeFolder}",
            'abstract' => null,
            'pdf_path' => $pdfPath,
            'date_production' => '2026-01-01',
            'source' => 'manuel',
        ]);
        echo "CREATE : {$titre}\n";
    }

    $recherche->domaines()->syncWithoutDetaching([$domaine->id]);

    $authorName = guessAuthorFromTitle($originalName) ?? guessAuthorFromTitle($titre);
    if ($authorName) {
        $auteur = Auteur::query()->firstOrCreate(['nom' => $authorName]);
        $recherche->auteurs()->syncWithoutDetaching([$auteur->id]);
    }

    $imported++;
}

echo "\nTerminé : {$imported} importé(s), {$skipped} ignoré(s), total recherches=" . Recherche::count() . "\n";
