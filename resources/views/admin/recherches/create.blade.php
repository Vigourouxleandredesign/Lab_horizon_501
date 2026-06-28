@extends('admin.layouts.app')
@section('content')
<div class="container" style="max-width:700px">
    <h1>Ajouter une recherche</h1>

    <form action="{{ route('admin.recherches.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="mb-3">
            <label class="form-label">Titre *</label>
            <input type="text" name="titre" class="form-control @error('titre') is-invalid @enderror"
                   value="{{ old('titre') }}">
            @error('titre')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>
        <div class="mb-3">
            <label class="form-label">Auteur</label>
            <input type="text" name="auteur" class="form-control" value="{{ old('auteur') }}">
        </div>
        <div class="mb-3">
            <label class="form-label">Domaine</label>
            <input type="text" name="domaine" class="form-control" value="{{ old('domaine') }}"
                   placeholder="ex: médecine, informatique, physique...">
        </div>
        <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea name="description" class="form-control" rows="4">{{ old('description') }}</textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">PDF de la recherche *</label>
            <input type="file" name="pdf" class="form-control @error('pdf') is-invalid @enderror" accept=".pdf">
            @error('pdf')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>
        <button type="submit" class="btn btn-primary">Enregistrer</button>
        <a href="{{ route('admin.recherches.index') }}" class="btn btn-secondary">Annuler</a>
    </form>
</div>
@endsection
