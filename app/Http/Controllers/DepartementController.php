<?php

namespace App\Http\Controllers;
use Inertia\Inertia;


use App\Models\Departement;


class DepartementController extends Controller{
    public function index(){
        $departements = Departement::with('fonctions')->get();

        return Inertia::render('Departements/Departements', [
            'departements' => $departements,
        ]);
    }
}