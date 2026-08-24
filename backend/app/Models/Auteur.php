<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auteur extends Model
{
    protected $fillable = ['nom', 'orcid'];

    public function recherches()
    {
        return $this->belongsToMany(Recherche::class, 'recherche_auteur');
    }
}
