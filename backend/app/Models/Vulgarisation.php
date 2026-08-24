<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vulgarisation extends Model
{
    protected $fillable = ['recherche_id', 'titre', 'resume', 'pdf_path', 'niveau_public', 'langue'];

    public function recherche()
    {
        return $this->belongsTo(Recherche::class);
    }

    public function getPdfUrlAttribute()
    {
        return asset('files/' . $this->pdf_path);
    }
}
