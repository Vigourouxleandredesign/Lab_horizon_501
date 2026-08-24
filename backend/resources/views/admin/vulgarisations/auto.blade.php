@extends('admin.layouts.app')

@section('content')
<div style="max-width:700px">
    <h1>Générer une vulgarisation avec l'IA</h1>
    <p class="text-muted">Pour : <strong>{{ $recherche->titre }}</strong></p>

    @if($recherche->pdf_path)
        <div class="alert alert-success">📄 PDF disponible — le LLM analysera le contenu complet.</div>
    @else
        <div class="alert alert-warning">⚠️ Pas de PDF — le LLM utilisera l'abstract.</div>
    @endif

    <form action="{{ route('admin.vulgarisations.generate', $recherche) }}" method="POST">
        @csrf
        <div class="mb-3">
            <label class="form-label">Niveau du public cible *</label>
            <select name="niveau_public" class="form-select">
                <option value="grand_public">Grand public</option>
                <option value="chercheurs">Chercheurs</option>
            </select>
        </div>

        <div class="mb-3">
            <label class="form-label">Langue *</label>
            <select name="langue" class="form-select">
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
            </select>
        </div>

        <button type="submit" class="btn btn-primary">
            🤖 Générer la vulgarisation
        </button>
        <a href="{{ route('admin.recherches.show', $recherche) }}" class="btn btn-secondary">Annuler</a>
    </form>
</div>
@endsection
