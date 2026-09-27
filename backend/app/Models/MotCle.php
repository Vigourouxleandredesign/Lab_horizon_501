<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MotCle extends Model
{
    protected $table = 'mots_cles';

    protected $fillable = ['label'];

    public function recherches()
    {
        return $this->belongsToMany(Recherche::class, 'recherche_mot_cle');
    }
}
