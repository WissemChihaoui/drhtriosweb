<?php

namespace App\Models;
use App\Models\Fonctions;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departement extends Model {
    public function fonctions() {
        return $this->hasMany(Fonctions::class, 'id_departement');
    }

    public function employees()
    {
        return $this->hasMany(Employee::class, 'id_departement');
    }
}