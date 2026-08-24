<section>
    <header>
        <h2 class="text-lg font-medium text-gray-900">
            Compte ORCID
        </h2>
        <p class="mt-1 text-sm text-gray-600">
            Liez votre ORCID pour importer automatiquement vos publications depuis HAL.
            <a href="https://orcid.org/register" target="_blank" class="text-indigo-600 underline">
                Créer un ORCID
            </a>
        </p>
    </header>

    {{-- Messages de statut --}}
    @if(session('status') === 'orcid-verified')
        <div class="mt-3 p-3 bg-green-100 text-green-700 rounded">
            ✅ ORCID vérifié et lié avec succès.
        </div>
    @elseif(session('status') === 'orcid-saved')
        <div class="mt-3 p-3 bg-yellow-100 text-yellow-700 rounded">
            ⚠️ ORCID enregistré mais non trouvé sur ORCID.org — vérifiez le format.
        </div>
    @elseif(session('status') === 'orcid-missing')
        <div class="mt-3 p-3 bg-red-100 text-red-700 rounded">
            Veuillez d'abord renseigner votre ORCID ci-dessous.
        </div>
    @endif

    {{-- ORCID actuel --}}
    @if(auth()->user()->orcid)
        <div class="mt-4 p-3 bg-gray-100 rounded flex items-center justify-between">
            <div>
                <strong>ORCID actuel :</strong>
                <a href="https://orcid.org/{{ auth()->user()->orcid }}" target="_blank"
                   class="text-indigo-600 underline ml-1">
                    {{ auth()->user()->orcid }}
                </a>
                @if(auth()->user()->orcid_verified)
                    <span class="text-green-600 ml-2 text-sm">✅ Vérifié</span>
                @else
                    <span class="text-yellow-600 ml-2 text-sm">⚠️ Non vérifié</span>
                @endif
            </div>
        </div>

        {{-- Bouton import --}}
        <form method="POST" action="{{ route('profile.orcid.import') }}" class="mt-4">
            @csrf
            <x-primary-button>
                ⬇️ Importer mes recherches HAL
            </x-primary-button>
            <p class="text-sm text-gray-500 mt-1">
                Importe toutes vos publications HAL associées à cet ORCID.
            </p>
        </form>
    @endif

    {{-- Formulaire ORCID --}}
    <form method="POST" action="{{ route('profile.orcid.update') }}" class="mt-6 space-y-4">
        @csrf
        <div>
            <x-input-label for="orcid" value="Mon ORCID" />
            <x-text-input
                id="orcid"
                name="orcid"
                type="text"
                class="mt-1 block w-full"
                value="{{ old('orcid', auth()->user()->orcid) }}"
                placeholder="0000-0002-1825-0097"
            />
            <x-input-error :messages="$errors->get('orcid')" class="mt-2" />
            <p class="text-sm text-gray-500 mt-1">Format : XXXX-XXXX-XXXX-XXXX</p>
        </div>

        <div class="flex items-center gap-4">
            <x-primary-button>Enregistrer l'ORCID</x-primary-button>
        </div>
    </form>
</section>
