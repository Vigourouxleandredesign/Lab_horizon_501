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
        $request->validate([
            'domaine' => 'nullable|string',
        ]);

        $domaine = $request->domaine ?: null;
        $docs    = $this->hal->fetchByDomaine($domaine);

        if (isset($docs['error'])) {
            return back()->with('error', $docs['error']);
        }

        $result = $this->hal->importDocs($docs);

        return redirect()->route('admin.recherches.index')
                         ->with('success',
                             "{$result['imported']} recherche(s) importée(s), {$result['skipped']} doublon(s) ignoré(s).");
    }
}
