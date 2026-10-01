<?php

namespace App\Jobs;

use App\Models\Recherche;
use App\Services\LlmService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\MaxAttemptsExceededException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class GenerateVulgarisationJob implements ShouldQueue
{
    use Queueable;

    /**
     * Durée max du job (s) : > services.llm.timeout (240 s par défaut) pour
     * laisser le temps à l'extraction PDF. Doit rester < retry_after de la
     * connexion redis (REDIS_QUEUE_RETRY_AFTER), sinon le job est relancé
     * alors qu'il tourne encore (MaxAttemptsExceededException).
     */
    public int $timeout = 300;

    public int $tries = 2;

    public int $backoff = 10;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected Recherche $recherche,
        protected string $niveau,
        protected string $langue,
    ) {}

    /** Clé cache de l'état de génération d'une recherche (affiché dans le back-office). */
    public static function statusKey(int $rechercheId): string
    {
        return "vulgarisation_status:{$rechercheId}";
    }

    /**
     * Execute the job.
     */

    public function handle(LlmService $llm): void
    {
        $context = ['recherche_id' => $this->recherche->id, 'niveau' => $this->niveau, 'langue' => $this->langue];
        Log::info('Vulgarisation IA : démarrage', $context + ['attempt' => $this->attempts()]);

        $texte = '';
        if ($this->recherche->pdf_path) {
            try {
                $texte = $llm->extrairePdf($this->recherche->pdf_path);
            } catch (Throwable $e) {
                // PDF chiffré / corrompu : smalot lève une exception -> repli sur l'abstract.
                Log::warning('Vulgarisation IA : PDF illisible, repli sur l\'abstract', $context + [
                    'pdf_path' => $this->recherche->pdf_path,
                    'error'    => $e->getMessage(),
                ]);
                if (trim((string) $this->recherche->abstract) === '') {
                    throw new RuntimeException('PDF illisible (' . $e->getMessage() . ') et aucun abstract.', 0, $e);
                }
            }
        }

        // PDF scanné / sans texte : on se rabat sur l'abstract.
        if ($texte === '') {
            $texte = trim((string) $this->recherche->abstract);
        }

        if ($texte === '') {
            throw new RuntimeException('Aucun texte exploitable (PDF vide et pas d\'abstract).');
        }

        $resume = $llm->vulgariser($texte, $this->niveau, $this->langue);

        $vulgarisation = $this->recherche->vulgarisations()->create([
            'titre'         => 'Vulgarisation — ' . $this->niveau . ' (' . strtoupper($this->langue) . ')',
            'resume'        => $resume,
            'niveau_public' => $this->niveau,
            'pdf_path'      => null,
            'langue'        => $this->langue,
        ]);

        Cache::forget(self::statusKey($this->recherche->id));

        Log::info('Vulgarisation IA : sauvegardée', $context + ['vulgarisation_id' => $vulgarisation->id]);
    }

    /**
     * Appelé quand toutes les tentatives ont échoué (y compris timeout).
     */
    public function failed(?Throwable $exception): void
    {
        $message = $exception?->getMessage() ?? 'Erreur inconnue';

        // Le worker est mort pendant le job (erreur fatale PHP comme un dépassement
        // mémoire, timeout ou redémarrage du conteneur) : aucune exception n'a
        // été levée, le vrai message est dans les logs du conteneur backend.
        if ($exception instanceof MaxAttemptsExceededException) {
            $message = 'Le worker a été interrompu pendant la génération (mémoire, timeout ou redémarrage). '
                . 'Voir : docker logs labhorizon-backend';
        }

        Log::error('Vulgarisation IA : échec', [
            'recherche_id' => $this->recherche->id,
            'niveau'       => $this->niveau,
            'langue'       => $this->langue,
            'error'        => $message,
        ]);

        Cache::put(self::statusKey($this->recherche->id), [
            'state'   => 'failed',
            'message' => mb_substr($message, 0, 300),
        ], now()->addDay());
    }
}
