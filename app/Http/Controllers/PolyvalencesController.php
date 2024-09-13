<?php
namespace App\Http\Controllers;


use App\Models\Polyvalences;
use App\Models\Employee;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PolyvalencesController extends Controller{
    public function index()
    {
        // Fetch employees and their associated polyvalences
        $employeesWithPolyvalences = Employee::with('polyvalences')
            ->whereHas('polyvalences') // Only include employees with polyvalences
            ->get();

        return Inertia::render('Polyvalences/Polyvalences', [
            'employeesWithPolyvalences' => $employeesWithPolyvalences,
        ]);
    }
}