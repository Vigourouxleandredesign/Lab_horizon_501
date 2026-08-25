<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

/**
 * Contenu métier local (recherches, PDF, auteurs, vulgarisations).
 * Snapshot JSON issu de la SQLite de dev — les fichiers restent dans public/files/.
 */
class LocalContentSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('recherches')->exists()) {
            return;
        }

        $path = database_path('seeders/local-content.json');
        if (! is_readable($path)) {
            $this->command?->warn('local-content.json introuvable — seed contenu ignoré.');

            return;
        }

        /** @var array<string, list<array<string, mixed>>> $payload */
        $payload = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        Schema::disableForeignKeyConstraints();

        $order = [
            'users',
            'domaines',
            'auteurs',
            'structures',
            'recherches',
            'vulgarisations',
            'recherche_domaine',
            'recherche_auteur',
            'recherche_structure',
        ];

        foreach ($order as $table) {
            $rows = $payload[$table] ?? [];
            if ($rows === []) {
                continue;
            }

            if ($table === 'users') {
                $rows = array_map(static function (array $row): array {
                    // Mot de passe démo Docker / seed : "password" (pas le hash SQLite machine-local).
                    $row['password'] = Hash::make('password');
                    $row['orcid_verified'] = (int) ($row['orcid_verified'] ?? 0);

                    return $row;
                }, $rows);
            }

            foreach (array_chunk($rows, 50) as $chunk) {
                DB::table($table)->insert($chunk);
            }
        }

        Schema::enableForeignKeyConstraints();
    }
}
