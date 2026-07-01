<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LabHorizon Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-dark bg-dark px-4">
        <a class="navbar-brand" href="{{ route('admin.recherches.index') }}">LabHorizon</a>
        <a class="navbar-brand" href="{{ route('admin.recherches.index')}}">Rechecherches</a>
        <a class="navbar-brand" href="{{ route('admin.hal.import')}}">Import Hal</a>
        {{-- Menu utilisateur --}}
    <div class="dropdown">
        <button class="btn btn-dark d-flex align-items-center gap-2 border border-secondary rounded-pill px-3"
                type="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{-- Avatar initiales --}}
            <div style="width:32px;height:32px;border-radius:50%;background:#6c757d;
                        display:flex;align-items:center;justify-content:center;
                        font-weight:bold;font-size:14px;color:white;">
                {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}
            </div>
            <div class="text-start lh-sm">
                <div class="text-white fw-semibold" style="font-size:13px;">{{ auth()->user()->name }}</div>
                <div class="text-secondary" style="font-size:11px;">{{ auth()->user()->email }}</div>
            </div>
        </button>

        <ul class="dropdown-menu dropdown-menu-end shadow" style="min-width:220px;">
            {{-- En-tête --}}
            <li class="px-3 py-2 border-bottom">
                <div class="fw-semibold">{{ auth()->user()->name }}</div>
                <div class="text-muted small">{{ auth()->user()->email }}</div>
                @if(auth()->user()->orcid)
                    <div class="text-muted small mt-1">
                        ORCID : {{ auth()->user()->orcid }}
                        @if(auth()->user()->orcid_verified)
                            <span class="text-success">✅</span>
                        @endif
                    </div>
                @endif
            </li>

            {{-- Profil --}}
            <li>
                <a class="dropdown-item d-flex align-items-center gap-2 py-2"
                   href="{{ route('profile.edit') }}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                         viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4z"/>
                    </svg>
                    Profil
                </a>
            </li>

            <li><hr class="dropdown-divider"></li>

            {{-- Déconnexion --}}
            <li>
                <form action="{{ route('logout') }}" method="POST">
                    @csrf
                    <button type="submit"
                            class="dropdown-item d-flex align-items-center gap-2 py-2 text-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                             viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
                        Se déconnecter
                    </button>
                </form>
            </li>
        </ul>
        </div>
    </nav>
    {{-- Bootstrap JS pour le dropdown du menu utilisateur--}}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <div class="container mt-4">
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        @yield('content')
    </div>
</body>
</html>
