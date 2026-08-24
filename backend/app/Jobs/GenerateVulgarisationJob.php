<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateVulgarisationJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */

    public function handle(LlmService $llm): void
    {
        $texte = $this->recherche->pdf_path
            ? $llm->extrairePdf($this->recherche->pdf_path)
            : $this->recherche->abstract;

        $resume = $llm->vulgariser($texte, $this->niveau, $this->langue);

        $this->recherche->vulgarisations()->create([
            'titre'         => 'Vulgarisation — ' . $this->niveau,
            'resume'        => $resume,
            'niveau_public' => $this->niveau,
            'langue'        => $this->langue,
        ]);
    }
}
