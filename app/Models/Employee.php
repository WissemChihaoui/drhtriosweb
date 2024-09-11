<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_societe',
        'id_departement',
        'id_fonction',
        'name',
        'birthdate',
        'gender',
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

    // The attributes that should be cast to native types.
    protected $casts = [
        'birthdate' => 'date',
        'date_embauche' => 'date',
        'start_date' => 'date',
        'end_date' => 'date'
    ];
}
