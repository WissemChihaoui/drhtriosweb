<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Sanctions;

class SanctionsController extends Controller{
    public function index(){
        $sanction = Sanctions::all();
        return Inertia::render('Sanctions/Sanctions', [
            'sanctions' => $sanction,
        ]);
    }
}