<?php

namespace Database\Seeders;

use App\Models\MotCle;
use App\Models\Recherche;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Mots-clés des recherches locales — backfill manuel (contenu de démo court,
 * pas de NLP). Idempotent indépendamment de LocalContentSeeder : tourne même
 * si `recherches` est déjà peuplée par un seed précédent.
 */
class MotsClesSeeder extends Seeder
{
    /** @var array<int, list<string>> Mots-clés par id de recherche (seed local-content.json). */
    private const KEYWORDS_BY_RECHERCHE_ID = [
        1 => ['Démonstration', 'Test'],
        2 => ['Changement climatique', 'Économie', 'Environnement'],
        3 => ['Santé publique', 'Maladie infectieuse', 'Modélisation', 'Environnement'],
        4 => ['Langues', 'Patrimoine culturel', 'Nouvelle-Calédonie'],
        5 => ['Urbanisme', 'Ville durable', 'Nouméa'],
        6 => ['Culture kanak', 'Bien-être', 'Société', 'Environnement'],
        7 => ['Mangrove', 'Écosystème', 'Biodiversité', 'Environnement'],
        8 => ['Santé publique', 'Obésité', 'Enfance', 'Pacifique'],
        9 => ['Pollution', 'Eau', 'Chrome', 'Environnement'],
        10 => ['Diversité', 'Société', 'Sciences sociales'],
        11 => ['Pollution atmosphérique', 'Incendies', 'Air', 'Santé'],
        12 => ['Pollution', 'Eau', 'Chrome', 'Environnement'],
        13 => ['Dépollution', 'Sols', 'Écologie'],
        14 => ['Pollution atmosphérique', 'Air', 'Mesures'],
        15 => ['Sols', 'Pollution', 'Métaux lourds', 'Dépollution'],
        16 => ['Intelligence artificielle', 'Santé publique', 'Modélisation', 'Données'],
        17 => ['Nature en ville', 'Urbanisme', 'Biodiversité'],
    ];

    public function run(): void
    {
        if (DB::table('mots_cles')->exists()) {
            return;
        }

        foreach (self::KEYWORDS_BY_RECHERCHE_ID as $rechercheId => $labels) {
            $recherche = Recherche::find($rechercheId);
            if (! $recherche) {
                continue;
            }

            $ids = collect($labels)->map(
                fn (string $label) => MotCle::firstOrCreate(['label' => $label])->id
            );

            $recherche->motsCles()->syncWithoutDetaching($ids);
        }
    }
}
