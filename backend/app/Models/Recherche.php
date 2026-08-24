<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recherche extends Model
{
    protected $fillable = ['user_id','titre', 'description', 'abstract', 'pdf_path', 'date_production', 'source', 'hal_id', 'hal_url'];

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
        return asset('files/' . $this->pdf_path);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function domaines()
    {
        return $this->belongsToMany(Domaine::class, 'recherche_domaine');
    }

    public function auteurs()
    {
        return $this->belongsToMany(Auteur::class, 'recherche_auteur');
    }

    public function structures()
    {
        return $this->belongsToMany(Structure::class, 'recherche_structure');
    }
}
