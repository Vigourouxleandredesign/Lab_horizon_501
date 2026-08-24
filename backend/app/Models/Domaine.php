<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Domaine extends Model
{
    protected $fillable = ['code', 'label'];

    public function recherches()
    {
        return $this->belongsToMany(Recherche::class, 'recherche_domaine');
    }
}
