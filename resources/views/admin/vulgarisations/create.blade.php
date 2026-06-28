@extends('admin.layouts.app')
@section('content')
<div class="container" style="max-width:700px">
    <h1>Ajouter une vulgarisation</h1>
    <p class="text-muted">Pour la recherche : <strong>{{ $recherche->titre }}</strong></p>

    <form action="{{ route('admin.vulgarisations.store', $recherche) }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="mb-3">
            <label class="form-label">Titre *</label>
            <input type="text" name="titre" class="form-control" value="{{ old('titre') }}">
        </div>
        <div class="mb-3">
            <label class="form-label">Niveau du public cible *</label>
            <select name="niveau_public" class="form-select">
                <option value="grand_public">Grand public</option>
                <option value="lyceen">Lycéen</option>
                <option value="collegien">Collégien</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">Résumé</label>
            <textarea name="resume" class="form-control" rows="4">{{ old('resume') }}</textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">PDF de vulgarisation *</label>
            <input type="file" name="pdf" class="form-control" accept=".pdf">
            @error('pdf')<div class="text-danger">{{ $message }}</div>@enderror
        </div>
        <button type="submit" class="btn btn-success">Associer</button>
        <a href="{{ route('admin.recherches.show', $recherche) }}" class="btn btn-secondary">Annuler</a>
    </form>
</div>
@endsection
