<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateVulgarisationJob;
use App\Models\Recherche;
use App\Models\Vulgarisation;
use App\Services\LlmService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class VulgarisationAutoController extends Controller
{
    public function __construct(protected LlmService $llm) {}

    public function create(Recherche $recherche)
    {
        abort_if($recherche->user_id !== auth()->id(), 403);

        if (!$recherche->pdf_path && !$recherche->abstract) {
            return back()->with('error', 'Aucun PDF ni abstract disponible pour cette recherche.');
        }

        return view('admin.vulgarisations.auto', compact('recherche'));
    }

    public function generate(Request $request, Recherche $recherche)
    {
        abort_if($recherche->user_id !== auth()->id(), 403);

        $request->validate([
            'niveau_public' => 'required|in:grand_public,chercheurs',
            'langue'        => 'required|in:fr,en',
            'resume'        => 'required|string',
        ]);

        $recherche->vulgarisations()->create([
            'titre'         => 'Vulgarisation — ' . $request->niveau_public . ' (' . strtoupper($request->langue) . ')',
            'resume'        => $request->resume,
            'niveau_public' => $request->niveau_public,
            'pdf_path'      => null,
            'langue'        => $request->langue,
        ]);

        return redirect()->route('admin.recherches.show', $recherche)
                         ->with('success', 'Vulgarisation sauvegardée.');
    }

    public function preview(Request $request, Recherche $recherche)
    {
        abort_if($recherche->user_id !== auth()->id(), 403);

        $request->validate([
            'niveau_public' => 'required|in:grand_public,chercheurs',
            'langue'        => 'required|in:fr,en',
        ]);

        if (!config('services.llm.enabled')) {
            return back()->with('error', 'La génération IA est désactivée (LLM_ENABLED=false).');
        }

        // État affiché sur la fiche recherche tant que le job n'a pas abouti
        // (TTL > durée max du job, au cas où le worker serait arrêté).
        Cache::put(GenerateVulgarisationJob::statusKey($recherche->id), [
            'state' => 'pending',
            'since' => now()->timestamp,
        ], now()->addMinutes(15));

        GenerateVulgarisationJob::dispatch(
            $recherche,
            $request->niveau_public,
            $request->langue
        );

        Log::info('Vulgarisation IA : job mis en file', [
            'recherche_id' => $recherche->id,
            'niveau'       => $request->niveau_public,
            'langue'       => $request->langue,
        ]);

        return redirect()->route('admin.recherches.show', $recherche)
                         ->with('success', 'Génération en cours — la vulgarisation apparaîtra dans quelques instants.');
    }
}
