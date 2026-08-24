<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Recherche;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RechercheController extends Controller
{
    public function index()
    {
        $recherches = Recherche::where('user_id', auth()->id())
                                 ->with(['auteurs', 'domaines'])
                                 ->withCount('vulgarisations')
                                 ->latest()
                                 ->paginate(15);

        return view('admin.recherches.index', compact('recherches'));
    }

    public function create()
    {
        return view('admin.recherches.create');
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
            'date_production' => $request->date_production,
            'source'      => 'manuel',
            'pdf_path'    => $pdfPath,
        ]);

        // Domaines
        if ($request->filled('domaines')) {
            foreach ((array)$request->domaines as $code) {
                $domaine = \App\Models\Domaine::firstOrCreate(
                    ['code'  => $code],
                    ['label' => $code]
                );
                $recherche->domaines()->syncWithoutDetaching([$domaine->id]);
            }
        }

        if (request()->expectsJson()) {
            return response()->json($recherche->load('domaines', 'auteurs'), 201);
        }

        return redirect()->route('admin.recherches.index')
                         ->with('success', 'Recherche ajoutée.');
    }

    public function show(Recherche $recherche)
    {
        abort_if($recherche->user_id !== auth()->id(), 403);

        $recherche->load('vulgarisations');
        return view('admin.recherches.show', compact('recherche'));
    }

    public function edit(Recherche $recherche)
    {
        abort_if($recherche->user_id !== auth()->id(), 403);

        return view('admin.recherches.edit', compact('recherche'));
    }

    public function update(Request $request, Recherche $recherche)
    {
        abort_if($recherche->user_id !== auth()->id(), 403);

        $request->validate([
            'titre' => 'required|string|max:255',
            'pdf' => 'nullable|mimetypes:application/pdf|max:20480',
        ]);

        if ($request->hasFile('pdf')) {
            if ($recherche->pdf_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($recherche->pdf_path);
            }
            $recherche->pdf_path = $request->file('pdf')->store('recherches', 'files');
        }

        $recherche->update($request->only(['titre', 'description', 'date_production'])
                 + ['pdf_path' => $recherche->pdf_path]);

        if (request()->expectsJson()) {
            return response()->json($recherche);
        }

        return redirect()->route('admin.recherches.show', $recherche)
                         ->with('success', 'Recherche mise à jour.');
    }

    public function destroy(Recherche $recherche)
    {
        abort_if($recherche->user_id !== auth()->id(), 403);

        // Vérifier que pdf_path existe avant de supprimer
        if ($recherche->pdf_path) {
            Storage::disk('public')->delete($recherche->pdf_path);
        }

        $recherche->delete();

        return redirect()->route('admin.recherches.index')
                         ->with('success', 'Recherche supprimée.');
    }
}

