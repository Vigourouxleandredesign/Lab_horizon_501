
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vulgarisation extends Model
{
    protected $fillable = ['recherche_id', 'titre', 'resume', 'pdf_path', 'niveau_public'];

    public function recherche()
    {
        return $this->belongsTo(Recherche::class);
    }

    public function getPdfUrlAttribute()
    {
        return asset('storage/' . $this->pdf_path);
    }
}
