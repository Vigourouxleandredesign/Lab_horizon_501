@extends('admin.layouts.app')

@section('content')
<div style="max-width:700px">
    <h1>Modifier la recherche</h1>

    <form action="{{ route('admin.recherches.update', $recherche) }}" method="POST" enctype="multipart/form-data">
        @csrf @method('PUT')
        <div class="mb-3">
            <label class="form-label">Titre *</label>
            <input type="text" name="titre" class="form-control" value="{{ old('titre', $recherche->titre) }}">
        </div>
        <div class="mb-3">
            <label class="form-label">Auteur</label>
            <input type="text" name="auteur" class="form-control" value="{{ old('auteur', $recherche->auteur) }}">
        </div>
        <div class="mb-3">
            <label class="form-label">Domaine</label>
            <input type="text" name="domaine" class="form-control" value="{{ old('domaine', $recherche->domaine) }}">
        </div>
        <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea name="description" class="form-control" rows="4">{{ old('description', $recherche->description) }}</textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">Mots-clés</label>
            <input type="text" name="mots_cles" class="form-control"
                   value="{{ old('mots_cles', $recherche->motsCles->pluck('label')->implode(', ')) }}"
                   placeholder="ex: biodiversité, climat, santé publique">
            <small class="text-muted">Séparés par des virgules — utilisés par la recherche et les filtres du site public.</small>
        </div>
        <div class="mb-3">
            <label class="form-label">Nouveau PDF <small class="text-muted">(laisser vide pour conserver l'actuel)</small></label>
            <input type="file" name="pdf" class="form-control" accept=".pdf">
            <small class="text-muted">Actuel : <a href="{{ $recherche->pdf_url }}" target="_blank">voir le PDF</a></small>
        </div>
        <button type="submit" class="btn btn-warning">Mettre à jour</button>
        <a href="{{ route('admin.recherches.show', $recherche) }}" class="btn btn-secondary">Annuler</a>
    </form>
</div>
@endsection
