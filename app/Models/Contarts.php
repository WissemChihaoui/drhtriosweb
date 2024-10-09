<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contarts extends Model
{
    protected $fillable = ['name'];

    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_contracts', 'contract_id', 'employee_id')
                    ->withPivot('contract_start_date', 'contract_end_date');
    }

}
