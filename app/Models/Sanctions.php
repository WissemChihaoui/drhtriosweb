<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sanctions extends Model
{
    use HasFactory;
    protected $fillable = ['id', 'type_sanction'];

    public function questionnaires()
    {
        return $this->hasMany(Questionnaire::class, 'id_sanction');
    }
}