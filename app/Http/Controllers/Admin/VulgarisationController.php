<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Recherche;
use App\Models\Vulgarisation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VulgarisationController extends Controller
{
    public function create(Recherche $recherche)
    {
        return view('admin.vulgarisations.create', compact('recherche'));
    }

    public function show(Recherche $recherche, Vulgarisation $vulgarisation)
    {
        return view('admin.vulgarisations.show', compact('vulgarisation'));
    }

    public function store(Request $request, Recherche $recherche)
    {
        $request->validate([
            'titre'         => 'required|string|max:255',
            'resume'        => 'nullable|string',
            'niveau_public' => 'required|in:grand_public,lyceen,collegien',
            'pdf'           => 'required|mimes:pdf|max:20480',
        ]);

        $path = $request->file('pdf')->store('vulgarisations', 'public');

        $recherche->vulgarisations()->create([
            'titre'         => $request->titre,
            'resume'        => $request->resume,
            'niveau_public' => $request->niveau_public,
            'pdf_path'      => $path,
        ]);

        return redirect()->route('admin.recherches.show', $recherche)
                         ->with('success', 'Vulgarisation associée avec succès.');
    }

    public function destroy(Recherche $recherche, Vulgarisation $vulgarisation)
    {
        Storage::disk('public')->delete($vulgarisation->pdf_path);
        $vulgarisation->delete();

        return redirect()->route('admin.recherches.show', $recherche)
                         ->with('success', 'Vulgarisation supprimée.');
    }
}

