@extends('admin.layouts.app')
@section('content')
<div class="container">
    <h1>{{ $recherche->titre }}</h1>
    <p><strong>Auteur :</strong> {{ $recherche->auteur ?? '—' }} | <strong>Domaine :</strong> {{ $recherche->domaine ?? '—' }}</p>
    <p>{{ $recherche->description }}</p>

    {{-- Bouton PDF de la recherche --}}
    @if($recherche->pdf_path)
        <a href="{{ $recherche->pdf_url }}" target="_blank" class="btn btn-outline-primary mb-4">
            📄 Voir le PDF de la recherche
        </a>
    @elseif($recherche->hal_url)
        <a href="{{ $recherche->hal_url }}" target="_blank" class="btn btn-outline-secondary mb-4">
            🔗 Voir sur HAL
        </a>
    @else
        <span class="badge bg-warning text-dark mb-4 d-inline-block">PDF non disponible</span>
    @endif

    <hr>
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>Vulgarisations associées ({{ $recherche->vulgarisations->count() }})</h3>
        <a href="{{ route('admin.vulgarisations.auto', $recherche) }}" class="btn btn-success">
            🤖 Vulgarisation auto
        </a>
        <a href="{{ route('admin.vulgarisations.create', $recherche) }}" class="btn btn-success">
            + Ajouter une vulgarisation
        </a>
    </div>

    @forelse($recherche->vulgarisations as $v)
    <div class="card mb-3">
        <div class="card-body d-flex justify-content-between align-items-start">
            <div>
                <h5>{{ $v->titre }}</h5>
                <span class="badge bg-secondary">{{ $v->niveau_public }}</span>
                <p class="mt-2 mb-0">{{ $v->resume }}</p>
            </div>
            <div class="d-flex gap-2">
                {{-- Bouton PDF de la vulgarisation --}}
                @if($v->pdf_path)
                    <a href="{{ $v->pdf_url }}" target="_blank" class="btn btn-sm btn-outline-info">📄 PDF</a>
                @endif
                <form action="{{ route('admin.vulgarisations.destroy', [$recherche, $v]) }}" method="POST">
                    @csrf @method('DELETE')
                    <button class="btn btn-sm btn-outline-danger" onclick="return confirm('Supprimer ?')">✕</button>
                </form>
            </div>
        </div>
    </div>
    @empty
        <p class="text-muted">Aucune vulgarisation associée pour l'instant.</p>
    @endforelse
</div>
@endsection
