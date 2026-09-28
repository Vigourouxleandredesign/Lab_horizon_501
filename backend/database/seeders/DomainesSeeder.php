<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Domaines ajoutés en plus du snapshot local-content.json.
 * Codes HAL (cf. HalImportService::LABELS_DOMAINES). Idempotent : relancé à
 * chaque démarrage du conteneur backend (RUN_SEED), sans doublon.
 */
class DomainesSeeder extends Seeder
{
    private const DOMAINES = [
        '0.chim' => 'Chimie',
        '0.math' => 'Mathématiques',
    ];

    public function run(): void
    {
        foreach (self::DOMAINES as $code => $label) {
            if (DB::table('domaines')->where('code', $code)->exists()) {
                continue;
            }

            DB::table('domaines')->insert([
                'code'       => $code,
                'label'      => $label,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
