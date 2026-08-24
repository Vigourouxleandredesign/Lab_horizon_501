<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recherche;
use Illuminate\Http\Request;

class RechercheApiController extends Controller
{
    public function index()
    {
        $recherches = Recherche::with(['domaines', 'auteurs'])
                               ->withCount('vulgarisations')
                               ->latest()
                               ->paginate(15);

        return response()->json($recherches);
    }

    public function show(Recherche $recherche)
    {
        $recherche->load(['domaines', 'auteurs', 'structures', 'vulgarisations']);
        return response()->json($recherche);
    }

    public function vulgarisations(Recherche $recherche)
    {
        return response()->json($recherche->vulgarisations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'pdf' => 'nullable|mimetypes:application/pdf|max:20480',
        ]);

        $pdfPath = null;
        if ($request->hasFile('pdf')) {
            $pdfPath = $request->file('pdf')->store('recherches', 'files');
        }

        $recherche = Recherche::create([
            'user_id'     => auth()->id(),
            'titre'       => $request->titre,
            'description' => $request->description,
            'source'      => 'manuel',
            'pdf_path'    => $pdfPath,
        ]);

        return response()->json($recherche, 201);
    }

    public function update(Request $request, Recherche $recherche)
    {
        abort_if($recherche->user_id !== auth()->id(), 403);

        $recherche->update($request->only(['titre', 'description']));

        return response()->json($recherche);
    }

    public function destroy(Recherche $recherche)
    {
        abort_if($recherche->user_id !== auth()->id(), 403);
        $recherche->delete();

        return response()->json(['message' => 'Recherche supprimée.']);
    }
}
