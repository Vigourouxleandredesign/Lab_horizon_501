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
        $params = [
            'q'    => '*:*',
            'rows' => $rows,
            'sort' => 'submittedDate_tdate desc',
            'fl'   => 'halId_s,title_s,authFullName_s,structName_s,domain_s,submittedDate_tdate,abstract_s,fileMain_s,uri_s',
            'wt'   => 'json',
        ];

        if ($domaine === null) {
            $params['fq']   = 'submittedDate_tdate:[NOW-1MONTH TO NOW]';
            $params['rows'] = 1000;
        } else {
            $params['fq'] = 'domain_s:"' . $domaine . '"';
        }

        $response = Http::timeout(30)->get(self::BASE_URL, $params);

        if ($response->failed()) {
            return ['error' => 'Erreur lors de la connexion à l\'API HAL.'];
        }

        return $response->json('response.docs') ?? [];
    }

    const LABELS_DOMAINES = [
    // Niveaux 0 — grandes disciplines
    '0.chim'             => 'Chimie',
    '0.info'             => 'Informatique',
    '0.math'             => 'Mathématiques',
    '0.nlin'             => 'Systèmes non linéaires',
    '0.phys'             => 'Physique',
    '0.scco'             => 'Sciences Cognitives',
    '0.sde'              => 'Sciences de la Terre',
    '0.sdv'              => 'Sciences du Vivant',
    '0.shs'              => 'Sciences Humaines et Sociales',
    '0.spi'              => 'Sciences de l\'Ingénieur',
    '0.stat'             => 'Statistiques',

    // Chimie
    '1.chim.anal'        => 'Chimie Analytique',
    '1.chim.cata'        => 'Catalyse',
    '1.chim.coor'        => 'Chimie de Coordination',
    '1.chim.geni'        => 'Génie Chimique',
    '1.chim.inor'        => 'Chimie Inorganique',
    '1.chim.mate'        => 'Chimie des Matériaux',
    '1.chim.orga'        => 'Chimie Organique',
    '1.chim.othe'        => 'Autre Chimie',
    '1.chim.poly'        => 'Polymères',
    '1.chim.ther'        => 'Chimie Théorique',
    '1.chim.theo'        => 'Chimie Théorique',
    '2.chim.cris'        => 'Cristallographie',

    // Informatique
    '1.info.info-ai'     => 'Intelligence Artificielle',
    '1.info.info-ar'     => 'Architecture Matérielle',
    '1.info.info-bi'     => 'Bioinformatique',
    '1.info.info-cc'     => 'Calcul Parallèle',
    '1.info.info-cl'     => 'Logique en Informatique',
    '1.info.info-cr'     => 'Cryptographie et Sécurité',
    '1.info.info-cv'     => 'Vision par Ordinateur',
    '1.info.info-db'     => 'Bases de Données',
    '1.info.info-dc'     => 'Calcul Distribué',
    '1.info.info-ds'     => 'Science des Données',
    '1.info.info-et'     => 'Systèmes Embarqués',
    '1.info.info-fl'     => 'Langages de Programmation',
    '1.info.info-gl'     => 'Génie Logiciel',
    '1.info.info-gr'     => 'Graphisme',
    '1.info.info-hc'     => 'Interaction Humain-Machine',
    '1.info.info-ir'     => 'Recherche d\'Information',
    '1.info.info-lg'     => 'Traitement du Langage Naturel',
    '1.info.info-lo'     => 'Logique en Informatique',
    '1.info.info-ma'     => 'Apprentissage Automatique',
    '1.info.info-mo'     => 'Modélisation et Simulation',
    '1.info.info-ms'     => 'Systèmes Mobiles',
    '1.info.info-na'     => 'Analyse Numérique',
    '1.info.info-ni'     => 'Réseaux et Internet',
    '1.info.info-oh'     => 'Autres Informatique',
    '1.info.info-os'     => 'Systèmes d\'Exploitation',
    '1.info.info-pb'     => 'Complexité Algorithmique',
    '1.info.info-pl'     => 'Langage de Programmation',
    '1.info.info-ro'     => 'Robotique',
    '1.info.info-sc'     => 'Calcul Scientifique',
    '1.info.info-sd'     => 'Structures de Données',
    '1.info.info-se'     => 'Systèmes Embarqués',
    '1.info.info-si'     => 'Systèmes d\'Information',
    '1.info.info-sy'     => 'Systèmes et Contrôle',
    '1.info.info-ts'     => 'Traitement du Signal',

    // Mathématiques
    '1.math.math-ag'     => 'Géométrie Algébrique',
    '1.math.math-ap'     => 'Analyse et EDP',
    '1.math.math-at'     => 'Topologie Algébrique',
    '1.math.math-ca'     => 'Analyse Classique',
    '1.math.math-co'     => 'Combinatoire',
    '1.math.math-ct'     => 'Théorie des Catégories',
    '1.math.math-cv'     => 'Variables Complexes',
    '1.math.math-dg'     => 'Géométrie Différentielle',
    '1.math.math-ds'     => 'Systèmes Dynamiques',
    '1.math.math-fa'     => 'Analyse Fonctionnelle',
    '1.math.math-gm'     => 'Mathématiques Générales',
    '1.math.math-gr'     => 'Théorie des Groupes',
    '1.math.math-gt'     => 'Topologie Géométrique',
    '1.math.math-ho'     => 'Histoire et Vue d\'ensemble',
    '1.math.math-it'     => 'Théorie de l\'Information',
    '1.math.math-kt'     => 'K-Theory et Homologie',
    '1.math.math-lo'     => 'Logique',
    '1.math.math-mg'     => 'Géométrie Métrique',
    '1.math.math-mp'     => 'Physique Mathématique',
    '1.math.math-na'     => 'Analyse Numérique',
    '1.math.math-nt'     => 'Théorie des Nombres',
    '1.math.math-oc'     => 'Optimisation et Contrôle',
    '1.math.math-ph'     => 'Physique Mathématique',
    '1.math.math-pr'     => 'Probabilités',
    '1.math.math-qa'     => 'Algèbre Quantique',
    '1.math.math-ra'     => 'Anneaux et Algèbres',
    '1.math.math-rt'     => 'Théorie des Représentations',
    '1.math.math-sg'     => 'Géométrie Symplectique',
    '1.math.math-sp'     => 'Spectral Theory',
    '1.math.math-st'     => 'Statistiques',

    // Physique
    '1.phys.astr'        => 'Astrophysique',
    '1.phys.astr.co'     => 'Cosmologie',
    '1.phys.astr.ep'     => 'Planétologie',
    '1.phys.astr.ga'     => 'Astrophysique Galactique',
    '1.phys.astr.he'     => 'Phénomènes Haute Énergie',
    '1.phys.astr.im'     => 'Instrumentation et Méthodes',
    '1.phys.astr.sr'     => 'Physique Solaire et Stellaire',
    '1.phys.atom'        => 'Physique Atomique',
    '1.phys.cond'        => 'Matière Condensée',
    '1.phys.cond.cm-ds'  => 'Matériaux Désordonnés',
    '1.phys.cond.cm-ms'  => 'Mécanique des Matériaux',
    '1.phys.cond.cm-sc'  => 'Supraconductivité',
    '1.phys.cond.cm-sm'  => 'Matière Molle',
    '1.phys.grqc'        => 'Relativité Générale',
    '1.phys.hep'         => 'Physique des Hautes Énergies',
    '1.phys.hep-ex'      => 'Physique des Hautes Énergies - Expérience',
    '1.phys.hep-lat'     => 'Physique des Hautes Énergies - Réseau',
    '1.phys.hep-ph'      => 'Physique des Hautes Énergies - Phénoménologie',
    '1.phys.hep-th'      => 'Physique des Hautes Énergies - Théorie',
    '1.phys.meca'        => 'Mécanique',
    '1.phys.meca.acou'   => 'Acoustique',
    '1.phys.meca.fluid'  => 'Mécanique des Fluides',
    '1.phys.meca.solid'  => 'Mécanique des Solides',
    '1.phys.meca.vibr'   => 'Vibrations',
    '1.phys.nucl'        => 'Physique Nucléaire',
    '1.phys.nexp'        => 'Physique Nucléaire Expérimentale',
    '1.phys.opti'        => 'Optique',
    '1.phys.plasm'       => 'Physique des Plasmas',
    '1.phys.qphy'        => 'Physique Quantique',

    // Sciences Cognitives
    '1.scco.ling'        => 'Linguistique',
    '1.scco.neur'        => 'Neurosciences',
    '1.scco.comp'        => 'Psychologie Cognitive',
    '1.scco.phil'        => 'Philosophie',

    // Sciences de la Terre
    '1.sde.be'           => 'Environnement et Société',
    '1.sde.es'           => 'Sciences de l\'Environnement',
    '1.sde.mcg'          => 'Géochimie',
    '1.sde.oc'           => 'Océanographie',
    '1.sde.pe'           => 'Paléontologie',
    '1.sde.phy'          => 'Géophysique',

    // Sciences du Vivant
    '1.sdv.ba'           => 'Biologie Animale',
    '1.sdv.bc'           => 'Biologie Cellulaire',
    '1.sdv.bid'          => 'Biodiversité',
    '1.sdv.bid.spe'      => 'Espèces et Évolution',
    '1.sdv.bibs'         => 'Bioinformatique',
    '1.sdv.bbm'          => 'Biochimie et Biologie Moléculaire',
    '1.sdv.bbm.bn'       => 'Biologie Nucléaire',
    '1.sdv.bbm.gtp'      => 'Génomique, Transcriptomique, Protéomique',
    '1.sdv.bbm.mc'       => 'Biologie Moléculaire et Cellulaire',
    '1.sdv.bdd'          => 'Biologie du Développement',
    '1.sdv.bv'           => 'Biologie Végétale',
    '1.sdv.can'          => 'Cancer',
    '1.sdv.ee'           => 'Écologie',
    '1.sdv.ee.bab'       => 'Biodiversité et Biologie des Populations',
    '1.sdv.ee.eco'       => 'Écosystèmes',
    '1.sdv.ee.evo'       => 'Évolution',
    '1.sdv.ee.ieo'       => 'Interactions Écologiques',
    '1.sdv.gen'          => 'Génétique',
    '1.sdv.gen.gpl'      => 'Génétique des Plantes',
    '1.sdv.imm'          => 'Immunologie',
    '1.sdv.mb'           => 'Microbiologie',
    '1.sdv.mb.mbm'       => 'Microbiologie Médicale',
    '1.sdv.mb.vir'       => 'Virologie',
    '1.sdv.mhep'         => 'Sciences Médicales',
    '1.sdv.mhep.csc'     => 'Cardiologie',
    '1.sdv.mhep.ger'     => 'Gériatrie',
    '1.sdv.mhep.me'      => 'Médecine Interne',
    '1.sdv.mhep.neo'     => 'Néonatologie',
    '1.sdv.mhep.neu'     => 'Neurologie',
    '1.sdv.mhep.onc'     => 'Oncologie',
    '1.sdv.mhep.ped'     => 'Pédiatrie',
    '1.sdv.mhep.psr'     => 'Psychiatrie',
    '1.sdv.neu'          => 'Neurobiologie',
    '1.sdv.neu.nb'       => 'Neurosciences Cognitives',
    '1.sdv.neu.nbc'      => 'Neurosciences Comportementales',
    '1.sdv.pa'           => 'Pathologies',
    '1.sdv.ph'           => 'Physiologie',
    '1.sdv.sa'           => 'Sciences Agricoles',
    '1.sdv.sa.agr'       => 'Agronomie',
    '1.sdv.sa.ap'        => 'Phytopathologie',
    '1.sdv.sa.spa'       => 'Sciences et Productions Animales',
    '1.sdv.sa.sta'       => 'Sciences et Techniques Agricoles',
    '1.sdv.spee'         => 'Santé Publique et Épidémiologie',
    '1.sdv.tox'          => 'Toxicologie',
    '2.sdv.aen'          => 'Alimentation et Nutrition',
    '2.sdv.bbm.gtp'      => 'Génomique',
    '2.sdv.ee.ieo'       => 'Écologie des Interactions',
    '2.sdv.sa.aep'       => 'Agronomie et Productions',
    '2.sdv.sa.sta'       => 'Sciences et Techniques Agricoles',
    '2.sdv.bibs'         => 'Bioinformatique',
    '2.sdv.bid'          => 'Biodiversité',
    '2.sdv.bbm'          => 'Biochimie Avancée',

    // Sciences Humaines et Sociales
    '1.shs.anthro-bio'   => 'Anthropologie Biologique',
    '1.shs.anthro-se'    => 'Anthropologie Sociale',
    '1.shs.archi'        => 'Architecture',
    '1.shs.art'          => 'Histoire de l\'Art',
    '1.shs.class'        => 'Études Classiques',
    '1.shs.demo'         => 'Démographie',
    '1.shs.droit'        => 'Droit',
    '1.shs.eco'          => 'Économie',
    '1.shs.edu'          => 'Sciences de l\'Éducation',
    '1.shs.envir'        => 'Environnement et Société',
    '1.shs.geo'          => 'Géographie',
    '1.shs.gestion'      => 'Gestion et Management',
    '1.shs.hist'         => 'Histoire',
    '1.shs.hisphilso'    => 'Histoire et Philosophie des Sciences',
    '1.shs.info'         => 'Sciences de l\'Information et Communication',
    '1.shs.langue'       => 'Linguistique',
    '1.shs.litt'         => 'Littérature',
    '1.shs.museo'        => 'Muséologie',
    '1.shs.musiq'        => 'Musicologie',
    '1.shs.phil'         => 'Philosophie',
    '1.shs.pol'          => 'Science Politique',
    '1.shs.psy'          => 'Psychologie',
    '1.shs.relig'        => 'Religions',
    '1.shs.scipo'        => 'Science Politique',
    '1.shs.socio'        => 'Sociologie',
    '1.shs.sport'        => 'STAPS',
    '2.shs.eco'          => 'Économie Appliquée',
    '2.shs.hist'         => 'Histoire Moderne',

    // Sciences de l'Ingénieur
    '1.spi.acou'         => 'Acoustique',
    '1.spi.auto'         => 'Automatique',
    '1.spi.elec'         => 'Électronique',
    '1.spi.fluid'        => 'Mécanique des Fluides',
    '1.spi.gproc'        => 'Génie des Procédés',
    '1.spi.groc'         => 'Génie Civil',
    '1.spi.mat'          => 'Matériaux',
    '1.spi.meca'         => 'Mécanique',
    '1.spi.nano'         => 'Nanotechnologies',
    '1.spi.opti'         => 'Optique et Photonique',
    '1.spi.other'        => 'Autre Sciences de l\'Ingénieur',
    '1.spi.signal'       => 'Traitement du Signal',
    '2.spi.elec'         => 'Génie Électrique',
    '2.spi.mat'          => 'Science des Matériaux',

    // Statistiques
    '1.stat.ap'          => 'Applications Statistiques',
    '1.stat.co'          => 'Calcul Statistique',
    '1.stat.me'          => 'Méthodologie',
    '1.stat.ml'          => 'Apprentissage Statistique',
    '1.stat.ot'          => 'Autres Statistiques',
    '1.stat.th'          => 'Statistiques Théoriques',
];

public static function traduireDomaines(array $codes): string
{
    return collect($codes)
        ->map(fn($code) => self::LABELS_DOMAINES[$code] ?? $code)
        ->unique()
        ->implode(', ');
}

public function importDocs(array $docs, bool $downloadPdf = true): array
{
    $imported = 0;
    $skipped  = 0;
    $failed   = 0;

    foreach ($docs as $doc) {
        $titre = is_array($doc['title_s'] ?? null)
            ? $doc['title_s'][0]
            : ($doc['title_s'] ?? 'Sans titre');

        $halId = $doc['halId_s'] ?? md5($titre . ($doc['submittedDate_tdate'] ?? ''));

        if (Recherche::where('hal_id', $halId)->exists()) {
            $skipped++;
            continue;
        }

        $pdfPath = null;

        if ($downloadPdf) {
            $pdfUrl = $doc['fileMain_s'] ?? null;
            if ($pdfUrl) {
                try {
                    $response = Http::timeout(30)->get($pdfUrl);
                    if ($response->ok()) {
                        $filename = 'recherches/hal_' . $halId . '.pdf';
                        file_put_contents(public_path('files/' . $filename), $response->body());
                        $pdfPath = $filename;
                    } else {
                        \Log::warning('PDF HAL non téléchargeable : ' . $pdfUrl . ' status: ' . $response->status());
                    }
                } catch (\Exception $e) {
                    \Log::error('PDF HAL erreur : ' . $e->getMessage());
                    $failed++;
                }
            }
        }

        Recherche::create([
            'titre'           => $titre,
            'abstract'        => is_array($doc['abstract_s'] ?? null)
                                 ? $doc['abstract_s'][0]
                                 : ($doc['abstract_s'] ?? null),
            'auteur'          => is_array($doc['authFullName_s'] ?? null)
                                 ? implode(', ', $doc['authFullName_s'])
                                 : ($doc['authFullName_s'] ?? null),
            'structure'       => is_array($doc['structName_s'] ?? null)
                                 ? implode(', ', $doc['structName_s'])
                                 : ($doc['structName_s'] ?? null),
            'domaine'         => is_array($doc['domain_s'] ?? null)
                                 ? implode(', ', $doc['domain_s'])
                                 : ($doc['domain_s'] ?? null),
            'date_production' => isset($doc['submittedDate_tdate'])
                                 ? substr($doc['submittedDate_tdate'], 0, 10)
                                 : null,
            'source'          => 'hal',
            'hal_id'          => $halId,
            'hal_url'         => $doc['uri_s'] ?? null,
            'pdf_path'        => $pdfPath,
        ]);

        $imported++;
    }

    return ['imported' => $imported, 'skipped' => $skipped, 'failed' => $failed];
    }
}
