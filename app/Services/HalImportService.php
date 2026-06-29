<?php

namespace App\Services;

use App\Models\Recherche;
use Illuminate\Support\Facades\Http;

class HalImportService
{
    const BASE_URL = 'https://api.archives-ouvertes.fr/search/';

    const DOMAINES = [
        'Tous (M-1)'              => null,
        'Humanities and Social Sciences' => 'Humanities and Social Sciences',
        'Life Sciences'           => 'Life Sciences',
        'Engineering Sciences'    => 'Engineering Sciences',
        'Physics'                 => 'Physics',
        'Mathematics'             => 'Mathematics',
        'Computer Science'        => 'Computer Science',
        'Earth Sciences'          => 'Earth Sciences',
        'Environmental Sciences'  => 'Environmental Sciences',
        'Chemical Sciences'       => 'Chemical Sciences',
        'Cognitive Sciences'      => 'Cognitive Sciences',
        'Medical Sciences'        => 'Medical Sciences',
        'Agricultural Sciences'   => 'Agricultural Sciences',
        'Astrophysics'            => 'Astrophysics',
        'Ecology'                 => 'Ecology',
        'Neurons and Cognition'   => 'Neurons and Cognition',
    ];

    public function fetchByDomaine(?string $domaine = null, int $rows = 500): array
    {
        if ($domaine === null) {
            $query = 'producedDate_tdate:[* TO NOW-1MONTH]';
            $rows  = 1000;
        } else {
            $query = 'domain_s:"' . $domaine . '"';
        }

        $response = Http::timeout(30)->get(self::BASE_URL, [
            'q'    => $query,
            'rows' => $rows,
            'sort' => 'producedDate_tdate desc',
            'fl'   => 'title_s,authFullName_s,structName_s,domain_s,producedDate_tdate,abstract_s',
            'wt'   => 'json',
        ]);

        if ($response->failed()) {
            return ['error' => 'Erreur lors de la connexion à l\'API HAL.'];
        }

        $docs = $response->json('response.docs') ?? [];

        return $docs;
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
                'date_production'=> isset($doc['producedDate_tdate'])
                                    ? substr($doc['producedDate_tdate'], 0, 10)
                                    : null,
                'source'         => 'hal',
                'hal_id'         => $halId,
            ]);

            $imported++;
        }

        return ['imported' => $imported, 'skipped' => $skipped];
    }
}
