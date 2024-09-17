<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Emp_presents;

class PresenceController extends Controller {
    public function index(){
        $presence = Emp_presents::with('employee')->get();
        dd($presence);
    }
}
