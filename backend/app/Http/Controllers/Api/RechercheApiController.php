<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recherche;
use Illuminate\Http\Request;

class RechercheApiController extends Controller
{
    /**
     * Liste publique — filtres q (titre/résumé/mots-clés/auteurs), category
     * (domaine), year, sort et pagination. Sans filtre : comportement
     * inchangé (dernières recherches, page de 15).
     */
    public function index(Request $request)
    {
        $query = Recherche::with(['domaines', 'auteurs', 'motsCles'])
                           ->withCount('vulgarisations');

        if ($request->filled('q')) {
            $search = trim((string) $request->input('q'));
            $query->where(function ($q) use ($search) {
                $q->where('titre', 'like', "%{$search}%")
                  ->orWhere('abstract', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('motsCles', fn ($mc) => $mc->where('label', 'like', "%{$search}%"))
                  ->orWhereHas('auteurs', fn ($a) => $a->where('nom', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('category')) {
            $category = trim((string) $request->input('category'));
            // Taxonomie front (UNC_CATEGORIES) et libellés domaine back pas
            // encore alignés (cf. docs/api-contract-v1.md §7.2) : match dans
            // les deux sens ("Géosciences" ⊂ "Géosciences (sciences de la Terre)").
            $query->whereHas('domaines', function ($d) use ($category) {
                $d->where('label', 'like', "%{$category}%")
                  ->orWhereRaw('? LIKE CONCAT(\'%\', label, \'%\')', [$category])
                  ->orWhere('code', $category);
            });
        }

        if ($request->filled('year')) {
            $query->whereYear('date_production', (int) $request->input('year'));
        }

        // Pas de moteur de scoring texte : "relevance" retombe sur le plus
        // récent (KISS), cf. docs/api-contract-v1.md §4 (sort = recent|relevance).
        $query->latest();

        $perPage = (int) $request->input('pageSize', 15);
        $perPage = $perPage > 0 ? min($perPage, 50) : 15;

        $recherches = $query->paginate($perPage);

        return response()->json($recherches);
    }

    public function show(Recherche $recherche)
    {
        $recherche->load(['domaines', 'auteurs', 'structures', 'motsCles', 'vulgarisations']);
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
