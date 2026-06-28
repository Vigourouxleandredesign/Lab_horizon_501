@extends('admin.layouts.app')

@section('content')
<div class="d-flex justify-content-between align-items-start mb-4">
    <div>
        <h1>{{ $vulgarisation->titre }}</h1>
        <span class="badge bg-secondary fs-6">{{ $vulgarisation->niveau_public }}</span>
    </div>
    <a href="{{ route('admin.recherches.show', $vulgarisation->recherche) }}" class="btn btn-outline-secondary">
        ← Retour à la recherche
    </a>
</div>

{{-- Recherche associée --}}
<div class="card mb-4 border-primary">
    <div class="card-header bg-primary text-white">Recherche associée</div>
    <div class="card-body">
        <h5>{{ $vulgarisation->recherche->titre }}</h5>
        <p class="mb-1"><strong>Auteur :</strong> {{ $vulgarisation->recherche->auteur ?? '—' }}</p>
        <p class="mb-2"><strong>Domaine :</strong> {{ $vulgarisation->recherche->domaine ?? '—' }}</p>
        <a href="{{ $vulgarisation->recherche->pdf_url }}" target="_blank" class="btn btn-sm btn-outline-primary">
            📄 Voir le PDF de la recherche
        </a>
    </div>
</div>

{{-- Contenu de la vulgarisation --}}
<div class="card mb-4">
    <div class="card-header">Vulgarisation</div>
    <div class="card-body">
        <p>{{ $vulgarisation->resume ?? 'Aucun résumé renseigné.' }}</p>
        <a href="{{ $vulgarisation->pdf_url }}" target="_blank" class="btn btn-outline-success">
            📄 Voir le PDF de vulgarisation
        </a>
    </div>
</div>

{{-- Actions --}}
<div class="d-flex gap-2">
    <form action="{{ route('admin.vulgarisations.destroy', [$vulgarisation->recherche, $vulgarisation]) }}"
          method="POST">
        @csrf @method('DELETE')
        <button class="btn btn-danger" onclick="return confirm('Supprimer cette vulgarisation ?')">
            Supprimer
        </button>
    </form>
</div>
@endsection
