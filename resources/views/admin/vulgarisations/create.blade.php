@extends('admin.layouts.app')

@section('content')
<div style="max-width:700px">
    <h1>Ajouter une vulgarisation</h1>
    <p class="text-muted">
        Pour la recherche : <strong>{{ $recherche->titre }}</strong>
    </p>

    <form action="{{ route('admin.vulgarisations.store', $recherche) }}" method="POST" enctype="multipart/form-data">
        @csrf

        <div class="mb-3">
            <label class="form-label">Titre *</label>
            <input type="text" name="titre"
                   class="form-control @error('titre') is-invalid @enderror"
                   value="{{ old('titre') }}">
            @error('titre')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>

        <div class="mb-3">
            <label class="form-label">Niveau du public cible *</label>
            <select name="niveau_public" class="form-select @error('niveau_public') is-invalid @enderror">
                <option value="grand_public" {{ old('niveau_public') == 'grand_public' ? 'selected' : '' }}>
                    Grand public
                </option>
                <option value="lyceen" {{ old('niveau_public') == 'chercheurs' ? 'selected' : '' }}>
                    Chercheurs
                </option>
            </select>
            @error('niveau_public')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>

        <div class="mb-3">
            <label class="form-label">Résumé</label>
            <textarea name="resume" class="form-control" rows="5"
                      placeholder="Expliquer la recherche en termes simples...">{{ old('resume') }}</textarea>
        </div>

        <div class="mb-3">
            <label class="form-label">PDF de vulgarisation *</label>
            <input type="file" name="pdf"
                   class="form-control @error('pdf') is-invalid @enderror"
                   accept=".pdf">
            @error('pdf')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>

        <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success">Associer</button>
            <a href="{{ route('admin.recherches.show', $recherche) }}" class="btn btn-secondary">Annuler</a>
        </div>
    </form>
</div>
@endsection
