<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class LlmService
{
    public function vulgariser(string $texte, string $niveau, string $langue): string
    {
        $niveauLabel = match($niveau) {
            'grand_public' => 'grand public (pas de jargon scientifique)',
            'chercheurs'       => 'chercheurs (jargon scientifique, exemples concrets)',

            default        => 'grand public',
        };

        $langueLabel = $langue === 'fr' ? 'français' : 'anglais';

        $prompt = <<<PROMPT
Tu es un expert en vulgarisation scientifique.
Résume le texte suivant pour un public de niveau : {$niveauLabel}.
Réponds uniquement en {$langueLabel}.
Le résumé doit faire entre 200 et 400 mots.
Commence directement par le résumé, sans introduction.

Texte à vulgariser :
{$texte}
PROMPT;

        $response = Http::timeout(120)->post(config('services.llm.url') . '/chat/completions', [
            'model'    => config('services.llm.model'),
            'messages' => [
                ['role' => 'system', 'content' => 'Tu es un expert en vulgarisation scientifique.'],
                ['role' => 'user',   'content' => $prompt],
            ],
            'temperature' => 0.7,
            'max_tokens'  => 600,
        ]);

        if ($response->failed()) {
            throw new \Exception('Erreur LLM : ' . $response->status());
        }

        return $response->json('choices.0.message.content') ?? '';
    }

    public function extrairePdf(string $pdfPath): string
    {
        $parser  = new \Smalot\PdfParser\Parser();
        $pdf     = $parser->parseFile(public_path('files/' . $pdfPath));
        $texte   = $pdf->getText();

        // Limite à 4000 caractères pour ne pas dépasser le context du LLM
        return substr($texte, 0, 4000);
    }
}
