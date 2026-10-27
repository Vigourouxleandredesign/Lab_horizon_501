<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Domaines ajoutés en plus du snapshot local-content.json.
 * Codes HAL (cf. HalImportService::LABELS_DOMAINES). Idempotent : relancé à
 * chaque démarrage du conteneur backend (RUN_SEED), sans doublon.
 */
class UserSeeder extends Seeder
{
    private const USERS = [
        [
            'name' => 'Labhorizon',
            'email' => 'test@labhorizon.nc',
            'password' => 'password',
        ],
    ];

    public function run(): void
    {
        foreach (self::USERS as $user) {
             DB::table('users')->updateOrInsert(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make($user['password']),
                    'updated_at' => now(),
                ]
            );
        }
    }
}

