@extends('admin.layouts.app')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1>Import depuis HAL</h1>
    <a href="{{ route('admin.recherches.index') }}" class="btn btn-outline-secondary">← Retour</a>
</div>

{{-- Formulaire de sélection --}}
<div class="card mb-4">
    <div class="card-body">
        <form action="{{ route('admin.hal.preview') }}" method="POST" class="row g-3">
            @csrf
            <div class="col-md-8">
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
            <div class="col-md-4 d-flex align-items-end">
                <button type="submit" class="btn btn-primary w-100">
                    🔍 Prévisualiser
                </button>
            </div>
        </form>
    </div>
</div>

{{-- Résultats de prévisualisation --}}
@isset($docs)
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <span>{{ count($docs) }} résultat(s) trouvé(s)</span>
        <form action="{{ route('admin.hal.import.store') }}" method="POST">
            @csrf
            <input type="hidden" name="domaine" value="{{ $domaine }}">
            <button type="submit" class="btn btn-success">
                ⬇️ Tout importer
            </button>
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
                            <small>{{ isset($doc['producedDate_tdate']) ? substr($doc['producedDate_tdate'], 0, 10) : '—' }}</small>
                        </td>
                        <td>
                            @if(!empty($doc['fileMain_s']))
                                <a href="{{ $doc['fileMain_s'] }}" target="_blank" class="badge bg-success">
                                    📄 Disponible
                                </a>
                            @elseif(!empty($doc['uri_s']))
                                <a href="{{ $doc['uri_s'] }}" target="_blank" class="badge bg-secondary">
                                    🔗 Fiche HAL
                                </a>
                            @else
                                <span class="badge bg-danger">Non disponible</span>
                            @endif
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
