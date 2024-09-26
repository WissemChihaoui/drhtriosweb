<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Employee;
use App\Models\Sanctions;


class Questionnaires extends Model
{
    use HasFactory;

    // Define the table name if necessary (optional)
    protected $table = 'questionnaires';

    // Specify the fillable attributes for mass assignment
    protected $fillable = [
        'id_emp',
        'id_sanction',
        'description',
        'date',
    ];

    /**
     * Get the employee that owns the questionnaire.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'id_emp');
    }

    /**
     * Get the sanction that belongs to the questionnaire.
     */
    public function sanctions()
    {
        return $this->belongsTo(Sanctions::class, 'id_sanction');
    }
}
