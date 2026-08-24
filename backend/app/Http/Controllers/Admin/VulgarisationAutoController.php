<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Recherche;
use App\Models\Vulgarisation;
use App\Services\LlmService;
use Illuminate\Http\Request;

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

        \App\Jobs\GenerateVulgarisationJob::dispatch(
            $recherche,
            $request->niveau_public,
            $request->langue
        );

        return redirect()->route('admin.recherches.show', $recherche)
                         ->with('success', 'Génération en cours — la vulgarisation apparaîtra dans quelques instants.');
    }
}
