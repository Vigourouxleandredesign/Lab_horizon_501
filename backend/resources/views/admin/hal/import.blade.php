@extends('admin.layouts.app')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1>Import depuis HAL</h1>
    <a href="{{ route('admin.recherches.index') }}" class="btn btn-outline-secondary">← Retour</a>
</div>

@if(session('warning'))
    <div class="alert alert-warning">{{ session('warning') }}</div>
@endif

{{-- Formulaire de sélection --}}
<div class="card mb-4">
    <div class="card-body">
        <form action="{{ route('admin.hal.preview') }}" method="POST" class="row g-3">
            @csrf
            <div class="col-md-6">
                <label class="form-label">Domaine</label>
                <select name="domaine" class="form-select">
                    @foreach($domaines as $label => $valeur)
                        <option value="{{ $valeur }}"
                            {{ (isset($domaine) && $domaine === $valeur) ? 'selected' : '' }}>
                            {{ $label }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">Nombre de résultats</label>
                <select name="rows" class="form-select">
                    <option value="50"  {{ (isset($rows) && $rows == 50)  ? 'selected' : '' }}>50</option>
                    <option value="100" {{ (isset($rows) && $rows == 100) ? 'selected' : '' }}>100</option>
                    <option value="200" {{ (isset($rows) && $rows == 200) ? 'selected' : '' }}>200</option>
                    <option value="500" {{ (isset($rows) && $rows == 500) ? 'selected' : '' }}>500</option>
                </select>
            </div>
            <div class="col-md-3 d-flex align-items-end">
                <button type="submit" class="btn btn-primary w-100">🔍 Prévisualiser</button>
            </div>
        </form>
    </div>
</div>

{{-- Résultats --}}
@isset($docs)
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span>{{ count($docs) }} résultat(s) trouvé(s)</span>
        <form action="{{ route('admin.hal.import') }}" method="POST">
            @csrf
            <input type="hidden" name="domaine" value="{{ $domaine }}">
            <input type="hidden" name="rows" value="{{ $rows ?? 500 }}">
            <button type="submit" class="btn btn-success">⬇️ Tout importer</button>
        </form>
    </div>
    <div class="card-body p-0">
        <div style="max-height: 600px; overflow-y: auto;">
            <table class="table table-sm table-hover mb-0">
                <thead class="table-dark sticky-top">
                    <tr>
                        <th>Titre</th>
                        <th>Auteur(s)</th>
                        <th>Domaine</th>
                        <th>Date</th>
                        <th>PDF</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($docs as $doc)
                    <tr>
                        <td>
                            {{ is_array($doc['title_s'] ?? null) ? $doc['title_s'][0] : ($doc['title_s'] ?? '—') }}
                        </td>
                        <td>
                            <small>{{ implode(', ', (array)($doc['authFullName_s'] ?? [])) ?: '—' }}</small>
                        </td>
                        <td>
                            <small>{{ \App\Services\HalImportService::traduireDomaines((array)($doc['domain_s'] ?? [])) ?: '—' }}</small>
                        </td>
                        <td>
                            <small>{{ isset($doc['submittedDate_tdate']) ? substr($doc['submittedDate_tdate'], 0, 10) : '—' }}</small>
                        </td>
                        <td>
                            @if(!empty($doc['fileMain_s']))
                                <a href="{{ $doc['fileMain_s'] }}" target="_blank" class="badge bg-success text-decoration-none">
                                    📄 Disponible
                                </a>
                            @elseif(!empty($doc['uri_s']))
                                <a href="{{ $doc['uri_s'] }}" target="_blank" class="badge bg-secondary text-decoration-none">
                                    🔗 Fiche HAL
                                </a>
                            @else
                                <span class="badge bg-danger">Non disponible</span>
                            @endif
                        </td>
                        <td>
                            {{-- Formulaire d'import unitaire --}}
                            <form action="{{ route('admin.hal.import.one') }}" method="POST">
                                @csrf
                                {{-- On passe toutes les données du doc en champs cachés --}}
                                <input type="hidden" name="doc[halId_s]"              value="{{ $doc['halId_s'] ?? '' }}">
                                <input type="hidden" name="doc[title_s]"              value="{{ is_array($doc['title_s'] ?? null) ? $doc['title_s'][0] : ($doc['title_s'] ?? '') }}">
                                <input type="hidden" name="doc[abstract_s]"           value="{{ is_array($doc['abstract_s'] ?? null) ? $doc['abstract_s'][0] : ($doc['abstract_s'] ?? '') }}">
                                <input type="hidden" name="doc[authFullName_s]"       value="{{ implode(', ', (array)($doc['authFullName_s'] ?? [])) }}">
                                <input type="hidden" name="doc[structName_s]"         value="{{ implode(', ', (array)($doc['structName_s'] ?? [])) }}">
                                <input type="hidden" name="doc[domain_s]"             value="{{ implode(', ', (array)($doc['domain_s'] ?? [])) }}">
                                <input type="hidden" name="doc[submittedDate_tdate]"  value="{{ $doc['submittedDate_tdate'] ?? '' }}">
                                <input type="hidden" name="doc[fileMain_s]"           value="{{ $doc['fileMain_s'] ?? '' }}">
                                <input type="hidden" name="doc[uri_s]"                value="{{ $doc['uri_s'] ?? '' }}">
                                <button type="submit" class="btn btn-sm btn-outline-primary">
                                    ⬇️ Importer
                                </button>
                            </form>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endisset

@endsection
