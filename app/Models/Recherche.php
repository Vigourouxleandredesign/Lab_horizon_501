<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recherche extends Model
{
    protected $fillable = ['titre', 'description', 'auteur', 'pdf_path', 'domaine'];

    public function vulgarisations()
    {
        return $this->hasMany(Vulgarisation::class);
    }

    // Accessor pour l'URL publique
    public function getPdfUrlAttribute()
    {
        return asset('storage/' . $this->pdf_path);
    }
}
