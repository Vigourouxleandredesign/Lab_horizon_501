<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\HalImportService;
use Illuminate\Http\Request;

class HalImportController extends Controller
{
    public function __construct(protected HalImportService $hal) {}

    public function index()
    {
        $domaines = HalImportService::DOMAINES;
        return view('admin.hal.import', compact('domaines'));
    }

    public function preview(Request $request)
    {
        $request->validate([
            'domaine' => 'nullable|string',
        ]);

        $domaine = $request->domaine ?: null;
        $docs    = $this->hal->fetchByDomaine($domaine);

        if (isset($docs['error'])) {
            return back()->with('error', $docs['error']);
        }

        $domaines = HalImportService::DOMAINES;
        return view('admin.hal.import', compact('docs', 'domaines', 'domaine'));
    }

    public function import(Request $request)
{
    $request->validate(['domaine' => 'nullable|string']);

    $domaine = $request->domaine ?: null;
    $rows    = (int) $request->input('rows', 500);
    $docs    = $this->hal->fetchByDomaine($domaine, $rows);

    if (isset($docs['error'])) {
        return back()->with('error', $docs['error']);
    }

    $result = $this->hal->importDocs($docs, true, auth()->id());

    return redirect()->route('admin.recherches.index')
                     ->with('success',
                         "{$result['imported']} importée(s), {$result['skipped']} doublon(s), {$result['failed']} PDF non disponible(s).");
}

public function importOne(Request $request)
{
    $doc = $request->input('doc');

    if (!$doc) {
        return redirect()->route('admin.hal.import')->with('error', 'Données manquantes.');
    }

    $result = $this->hal->importDocs([$doc], false, auth()->id());

    if ($result['skipped'] > 0) {
        return redirect()->route('admin.hal.import')->with('warning', 'Cette recherche est déjà importée.');
    }

    return redirect()->route('admin.hal.import')->with('success', 'Recherche importée avec succès.');
}

// Nouvel import via ORCID
public function importOrcid(Request $request)
{
    $user = auth()->user();

    if (!$user->orcid) {
        return redirect()->route('profile.edit')
                         ->with('error', 'Veuillez d\'abord lier votre ORCID dans votre profil.');
    }

    $docs = $this->hal->fetchByOrcid($user->orcid);

    if (isset($docs['error'])) {
        return back()->with('error', $docs['error']);
    }

    $result = $this->hal->importDocs($docs, false, $user->id);

    return redirect()->route('admin.recherches.index')
                     ->with('success',
                         "{$result['imported']} de vos recherches importée(s), {$result['skipped']} déjà présente(s).");
}

}
