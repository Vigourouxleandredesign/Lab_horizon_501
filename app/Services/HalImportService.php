<?php

namespace App\Services;

use App\Models\Recherche;
use Illuminate\Support\Facades\Http;

class HalImportService
{
    const BASE_URL = 'https://api.archives-ouvertes.fr/search/';

    const DOMAINES = [
        'Tous (M-1)'                        => null,
        'Sciences Humaines et Sociales'     => '0.shs',
        'Sciences du Vivant'                => '0.sdv',
        'Sciences de l\'Ingénieur'          => '0.spi',
        'Physique'                          => '0.phys',
        'Mathématiques'                     => '0.math',
        'Informatique'                      => '0.info',
        'Sciences de la Terre'              => '0.sde',
        'Chimie'                            => '0.chim',
        'Sciences Cognitives'               => '0.scco',
        'Neurosciences'                     => '1.scco.neur',
        'Sciences Médicales'                => '1.sdv.mhep',
        'Sciences Agricoles'                => '1.sdv.sa',
        'Astrophysique'                     => '1.phys.astr',
        'Écologie'                          => '1.sdv.ee',
    ];

    public function fetchByDomaine(?string $domaine = null, int $rows = 500): array
    {
        // Paramètres communs
        $params = [
            'q'    => '*:*',
            'rows' => $rows,
            'sort' => 'submittedDate_tdate desc',
            'fl'   => 'halId_s,title_s,authFullName_s,structName_s,domain_s,submittedDate_tdate,abstract_s',
            'wt'   => 'json',
        ];

        // Filtre global M-1
        if ($domaine === null) {
            $params['fq']   = 'submittedDate_tdate:[NOW-1MONTH TO NOW]';
            $params['rows'] = 1000;
        } else {
            $params['fq'] = 'domain_s:"' . $domaine . '"';  // guillemets obligatoires
        }

        $response = Http::timeout(30)->get(self::BASE_URL, $params);

        if ($response->failed()) {
            return ['error' => 'Erreur lors de la connexion à l\'API HAL.'];
        }

        return $response->json('response.docs') ?? [];
    }

    public function importDocs(array $docs): array
    {
        $imported = 0;
        $skipped  = 0;

        foreach ($docs as $doc) {
            $titre = is_array($doc['title_s'] ?? null)
                ? $doc['title_s'][0]
                : ($doc['title_s'] ?? 'Sans titre');

            // Génère un ID unique basé sur titre + date
            $halId = md5($titre . ($doc['producedDate_tdate'] ?? ''));

            if (Recherche::where('hal_id', $halId)->exists()) {
                $skipped++;
                continue;
            }

            Recherche::create([
                'titre'          => $titre,
                'abstract'       => is_array($doc['abstract_s'] ?? null)
                                    ? $doc['abstract_s'][0]
                                    : ($doc['abstract_s'] ?? null),
                'auteur'         => implode(', ', (array)($doc['authFullName_s'] ?? [])),
                'structure'      => implode(', ', (array)($doc['structName_s'] ?? [])),
                'domaine'        => implode(', ', (array)($doc['domain_s'] ?? [])),
                'date_production'=> isset($doc['submittedDate_tdate'])
                                    ? substr($doc['submittedDate_tdatex'], 0, 10)
                                    : null,
                'source'         => 'hal',
                'hal_id'         => $halId,
            ]);

            $imported++;
        }

        return ['imported' => $imported, 'skipped' => $skipped];
    }
}
