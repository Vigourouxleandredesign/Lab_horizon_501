<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Services\HalImportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;

class ProfileController extends Controller
{
    public function __construct(protected HalImportService $hal) {}

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): View
    {
        return view('profile.edit', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Update ORCID.
     */
    public function updateOrcid(Request $request): RedirectResponse
    {
        $request->validate([
            'orcid' => ['nullable', 'string', 'regex:/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/'],
        ]);

        $user     = $request->user();
        $orcid    = $request->orcid;
        $verified = false;

        if ($orcid) {
            $response = Http::timeout(10)
                ->withHeaders(['Accept' => 'application/json'])
                ->get("https://pub.orcid.org/v3.0/{$orcid}/record");
            $verified = $response->ok();
        }

        $user->update([
            'orcid'          => $orcid,
            'orcid_verified' => $verified,
        ]);

        return Redirect::route('profile.edit')
                       ->with('status', $verified ? 'orcid-verified' : 'orcid-saved');
    }

    /**
     * Import HAL publications via ORCID.
     */
    public function importOrcid(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user->orcid) {
            return Redirect::route('profile.edit')
                           ->with('status', 'orcid-missing');
        }

        $docs = $this->hal->fetchByOrcid($user->orcid);

        if (isset($docs['error'])) {
            return Redirect::route('profile.edit')->with('error', $docs['error']);
        }

        $result = $this->hal->importDocs($docs, false, $user->id);

        return Redirect::route('admin.recherches.index')
                       ->with('success',
                           "{$result['imported']} recherche(s) importée(s), {$result['skipped']} déjà présente(s).");
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
