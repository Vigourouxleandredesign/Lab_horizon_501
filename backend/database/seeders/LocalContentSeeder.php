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

                // Pour les users, on insère un par un ou via updateOrInsert sur l'email
                // afin d'éviter tout conflit sur l'ID déjà généré par UserSeeder
                foreach ($rows as $userRow) {
                    $email = $userRow['email'];
                    unset($userRow['created_at']); // Ne pas écraser created_at si existant

                    // Si un utilisateur avec cet email existe déjà, on ne touche pas à son ID
                    if (DB::table('users')->where('email', $email)->exists()) {
                        unset($userRow['id']);
                        DB::table('users')->where('email', $email)->update($userRow);
                    } else {
                        // Si l'id du JSON est déjà pris par un autre compte, on laisse l'auto-incrément
                        if (isset($userRow['id']) && DB::table('users')->where('id', $userRow['id'])->exists()) {
                            unset($userRow['id']);
                        }
                        DB::table('users')->insert($userRow);
                    }
                }
                continue;
            }

            // Pour toutes les autres tables : par lots de 50
            foreach (array_chunk($rows, 50) as $chunk) {
                if (str_starts_with($table, 'recherche_')) {
                    // Tables de liaison N-N sans ID unique auto-incrémenté
                    DB::table($table)->insertOrIgnore($chunk);
                } else {
                    // Tables d'entités avec clé primaire 'id'
                    $columns = array_keys($chunk[0]);
                    $updateColumns = array_diff($columns, ['id', 'created_at']);

                    DB::table($table)->upsert($chunk, ['id'], $updateColumns);
                }
            }
        }

        Schema::enableForeignKeyConstraints();
    }
}