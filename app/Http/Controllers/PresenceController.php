<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Emp_presents;
use App\Models\Conges;

class PresenceController extends Controller {
    public function index(){
        $presences = Emp_presents::with('employee')->get();
        $conges = Conges::all();
        // dd($conges);
        return Inertia::render('Presences/Presences', [
            'presences' => $presences,
            'conges' => $conges,
        ]);
    }

    public function createPresencePage(){
        $presences = Emp_presents::select('emp_presents.*', 'type_salairs.type as typesalaire')->with('employee')
        ->leftJoin('employee_contracts', 'employee_contracts.employee_id', 'emp_presents.employee_id')
        ->leftJoin('type_salairs', 'type_salairs.id', 'employee_contracts.salary_type_id')
        
        ->get();
        $conges = Conges::all();

        return Inertia::render('Presences/CreatePresence', [
            'presences' => $presences,
            'conges' => $conges,
        ]);
    }

    public function createPresencePageCustomDate($date){
        dd($date);
    }
}
