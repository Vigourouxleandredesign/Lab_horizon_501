<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Structure extends Model
{
    protected $fillable = ['nom'];

    public function recherches()
    {
        return $this->belongsToMany(Recherche::class, 'recherche_structure');
    }
}
