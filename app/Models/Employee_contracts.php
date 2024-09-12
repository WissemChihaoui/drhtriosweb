<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee_contracts extends Model
{
    use HasFactory;


    protected $fillable = [
        'name',
        'employee_id',
        'contract_id',
        'salary_type_id',
        'hire_date',
        'contract_start_date',
        'contract_end_date',
        'amount',
    ];

    protected $casts = [
        'hire_date' => 'date',
        'contract_start_date' => 'date',
        'contract_end_date' => 'date',
        'amount' => 'decimal:2',
    ];
}
