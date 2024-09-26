<?php
namespace App\Http\Controllers;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Questionnaires;
use App\Models\Employee;
use App\Models\Sanctions;


class QuestionnaireController extends Controller{
    public function index(){
        $questionnaires = Questionnaires::with(['employee', 'sanctions'])->get();
        $employees = Employee::all();
        $sanctions = Sanctions::all();
        // dd($sanctions);
        return Inertia::render('Questionnaire/Questionnaire', [
            'questionnaires' => $questionnaires,
            'employees' => $employees,
            'sanctions' => $sanctions
        ]);
    }

    public function store(Request $request)
    {
        // Validate the incoming data
        $validatedData = $request->validate([
            'id_emp' => 'required|exists:employees,id', // Ensure employee exists
            'id_sanction' => 'required|exists:sanctions,id', // Ensure sanction exists
            'description' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        $formattedDate = Carbon::parse($validatedData['date'])->format('Y-m-d');

        // Create a new questionnaire
        $questionnaire = Questionnaires::create([
            'id_emp' => $validatedData['id_emp'],
            'id_sanction' => $validatedData['id_sanction'],
            'description' => $validatedData['description'],
            'date' => $formattedDate,  // Assuming the date is formatted correctly
        ]);

       return redirect()->route('questionnaire')->with('success', 'questionnaire a été ajouté.');
    }
}