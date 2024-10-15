<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Emp_presents;
use App\Models\Contarts;
use Illuminate\Database\Eloquent\SoftDeletes;
class Employee extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'id_societe',
        'id_departement',
        'id_fonction',
        'name',
        'birthdate',
        'gender',
        'employeeID',
        'phone',
        'address',
        'email',
        'category',
        'contract',
        'date_embauche',
        'start_date',
        'end_date',
        'salary',
        'polyvalence',
        'resume',
        'document',
        'cin'
    ];

    protected $casts = [
        'birthdate' => 'date',
        'date_embauche' => 'date',
        'start_date' => 'date',
        'end_date' => 'date'
    ];

    public function polyvalences()
    {
        return $this->belongsToMany(Polyvalences::class, 'emp_polys', 'id_emp', 'id_polyvalence')
                    ->withTimestamps(); // Include timestamps if you need them
    }
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
    public function emp_presents()
    {
        return $this->hasMany(Emp_presents::class, 'employee_id');
    }
    public function questionnaires()
    {
        return $this->hasMany(Questionnaire::class, 'id_emp');
    }
    public function contarts()
    {
        return $this->belongsToMany(Contarts::class, 'employee_contracts', 'employee_id', 'contract_id')
                    ->withPivot('contract_start_date', 'contract_end_date');
    }
    public function departement()
    {
        return $this->belongsTo(Departement::class, 'id_departement');
    }
}

