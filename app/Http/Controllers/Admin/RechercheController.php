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
            'titre'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'auteur'      => 'nullable|string|max:255',
            'domaine'     => 'nullable|string|max:100',
            'pdf'         => 'required|mimes:pdf|max:20480', // 20 MB max
        ]);

        $path = $request->file('pdf')->store('recherches', 'public');

        $path = $request->file('pdf')->store('recherches', 'public');

    Recherche::create([
        'user_id'     => auth()->id(),  // ← ajouter
        'titre'       => $request->titre,
        'description' => $request->description,
        'auteur'      => $request->auteur,
        'domaine'     => $request->domaine,
        'pdf_path'    => $path,
    ]);

    return redirect()->route('admin.recherches.index')
                     ->with('success', 'Recherche ajoutée avec succès.');
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
            'titre'  => 'required|string|max:255',
            'pdf'    => 'nullable|mimes:pdf|max:20480',
        ]);

        if ($request->hasFile('pdf')) {
            // Supprimer l'ancien fichier
            Storage::disk('public')->delete($recherche->pdf_path);
            $recherche->pdf_path = $request->file('pdf')->store('recherches', 'public');
        }

        $recherche->update($request->only(['titre', 'description', 'auteur', 'domaine'])
                 + ['pdf_path' => $recherche->pdf_path]);

        return redirect()->route('admin.recherches.show', $recherche)
                         ->with('success', 'Recherche mise à jour.');
    }

    public function destroy(Recherche $recherche)
    {
        abort_if($recherche->user_id !== auth()->id(), 403);

        Storage::disk('public')->delete($recherche->pdf_path);
        $recherche->delete();

        return redirect()->route('admin.recherches.index')
                         ->with('success', 'Recherche supprimée.');
    }
}

