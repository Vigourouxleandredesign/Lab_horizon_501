<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

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

        $url   = rtrim((string) config('services.llm.url'), '/') . '/chat/completions';
        $model = config('services.llm.model');

        Log::info('LLM : requête de vulgarisation', [
            'url' => $url, 'model' => $model, 'niveau' => $niveau, 'langue' => $langue,
            'input_chars' => mb_strlen($texte),
        ]);
        $start = microtime(true);

        try {
            $response = Http::timeout((int) config('services.llm.timeout', 240))
                ->connectTimeout(10)
                ->acceptJson()
                ->post($url, [
                    'model'    => $model,
                    'messages' => [
                        ['role' => 'system', 'content' => 'Tu es un expert en vulgarisation scientifique.'],
                        ['role' => 'user',   'content' => $prompt],
                    ],
                    'temperature' => 0.7,
                    'max_tokens'  => 600,
                ]);
        } catch (ConnectionException $e) {
            throw new RuntimeException("Service IA injoignable ({$url}) : " . $e->getMessage(), 0, $e);
        }

        if ($response->failed()) {
            throw new RuntimeException(sprintf(
                'Erreur LLM HTTP %d (modèle "%s") : %s',
                $response->status(), $model, mb_substr($response->body(), 0, 500)
            ));
        }

        $contenu = trim((string) $response->json('choices.0.message.content'));

        if ($contenu === '') {
            throw new RuntimeException('Réponse LLM vide ou inattendue : ' . mb_substr($response->body(), 0, 500));
        }

        Log::info('LLM : vulgarisation reçue', [
            'model' => $model,
            'duration_s' => round(microtime(true) - $start, 1),
            'output_chars' => mb_strlen($contenu),
        ]);

        return $contenu;
    }

    public function extrairePdf(string $pdfPath): string
    {
        $fullPath = public_path('files/' . $pdfPath);

        if (!is_file($fullPath)) {
            throw new RuntimeException("PDF introuvable : {$fullPath}");
        }

        // Sans le contenu binaire des images : seul le texte nous intéresse, et
        // les PDF illustrés (7–20 Mo) dépassaient la limite mémoire du worker.
        $config = new \Smalot\PdfParser\Config();
        $config->setRetainImageContent(false);

        $parser  = new \Smalot\PdfParser\Parser([], $config);
        $pdf     = $parser->parseFile($fullPath);
        // Nettoie les octets UTF-8 invalides (sinon json_encode échoue à l'envoi).
        $texte   = trim(mb_convert_encoding($pdf->getText(), 'UTF-8', 'UTF-8'));

        // Limite à 4000 caractères pour ne pas dépasser le context du LLM
        // (mb_substr : substr pouvait couper un caractère UTF-8 et casser le JSON envoyé).
        return mb_substr($texte, 0, 4000);
    }
}
