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
                $this->upsertRows($table, $chunk);
            }
        }

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Insère ou met à jour les données de manière idempotente.
     *
     * @param array<int, array<string, mixed>> $chunk
     */
    private function upsertRows(string $table, array $chunk): void
    {
        // Pour les tables pivots sans clé primaire 'id' unique
        if (str_starts_with($table, 'recherche_')) {
            // insertOrIgnore évite les erreurs sur les paires de clés déjà existantes
            DB::table($table)->insertOrIgnore($chunk);
            return;
        }

        $columns = array_keys($chunk[0]);

        // Pour la table 'users', la collision peut venir de l'id OU de l'email
        if ($table === 'users') {
            // Colonnes à mettre à jour en cas de conflit
            $updateColumns = array_diff($columns, ['id', 'email', 'created_at']);

            DB::table($table)->upsert(
                $chunk,
                ['email'], // Clé unique de détection du conflit
                $updateColumns
            );
            return;
        }

        // Pour les autres entités ayant un ID primaire
        $updateColumns = array_diff($columns, ['id', 'created_at']);

        DB::table($table)->upsert(
            $chunk,
            ['id'],
            $updateColumns
        );
    }
}