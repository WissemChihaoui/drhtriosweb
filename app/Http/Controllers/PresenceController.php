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
}
