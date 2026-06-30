<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recherche extends Model
{
    protected $fillable = ['titre', 'description', 'abstract', 'auteur', 'structure', 'pdf_path', 'domaine', 'date_production', 'source', 'hal_id', 'hal_url'];

    public function vulgarisations()
    {
        return $this->hasMany(Vulgarisation::class);
    }

    // Accessor pour l'URL publique
    public function getPdfUrlAttribute()
    {
        if (!$this->pdf_path) {
            return null;  // ← retourne null au lieu de asset('files/')
        }
        return asset('storage/' . $this->pdf_path);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
