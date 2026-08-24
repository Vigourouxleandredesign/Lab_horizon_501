@extends('admin.layouts.app')

@section('content')
<div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Recherches</h1>
        <a href="{{ route('admin.recherches.create') }}" class="btn btn-primary">+ Ajouter</a>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Titre</th><th>Auteur</th><th>Domaine</th><th>Vulgarisations</th><th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($recherches as $r)
            <tr>
                <td>{{ $r->titre }}</td>
                <<td>
                    {{ $r->auteurs->pluck('nom')->implode(', ') ?: '—' }}
                </td>
                <td>
                    {{ $r->domaines->pluck('label')->implode(', ') ?: '—' }}
                </td>
                <td>{{ $r->vulgarisations_count }}</td>
                <td>
                    <a href="{{ route('admin.recherches.show', $r) }}" class="btn btn-sm btn-info">Voir</a>
                    <a href="{{ route('admin.recherches.edit', $r) }}" class="btn btn-sm btn-warning">Éditer</a>
                    <form action="{{ route('admin.recherches.destroy', $r) }}" method="POST" class="d-inline">
                        @csrf @method('DELETE')
                        <button class="btn btn-sm btn-danger" onclick="return confirm('Supprimer ?')">Supprimer</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    {{ $recherches->links() }}
</div>
@endsection
