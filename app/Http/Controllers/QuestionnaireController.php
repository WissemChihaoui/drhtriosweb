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
            'id_emp' => 'required|exists:employees,id',
            'id_sanction' => 'required|exists:sanctions,id',
            'description' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        $formattedDate = Carbon::parse($validatedData['date'])->format('Y-m-d');

        if ($request -> id){
            $questionnaire = Questionnaires::findOrFail($request ->id);
            $questionnaire->id_emp = $validatedData['id_emp'];
            $questionnaire->id_sanction = $validatedData['id_sanction'];
            $questionnaire->description = $validatedData['description'];
            $questionnaire->date = $validatedData['date'];
            $questionnaire->save();
        }else{
            // Create a new questionnaire
            $questionnaire = Questionnaires::create([
                'id_emp' => $validatedData['id_emp'],
                'id_sanction' => $validatedData['id_sanction'],
                'description' => $validatedData['description'],
                'date' => $formattedDate,
            ]);
        }

       return redirect()->route('questionnaire')->with('success', 'Questionnaire a été ajouté.');
    }

    public function destroy($id){
        Questionnaires::where('id', $id) -> delete();
        return redirect()-> route('questionnaire')->with('success', 'Questionnaire deleted successfully.');
    }

    public function destroyMultiple(Request $request){
        $ids = $request->input('ids');
        
        if (!is_array($ids)) {
            return Inertia::render('Questionnaire/Questionnaire', [
                'error' => 'Invalid data'
            ]);
        }

        Questionnaires::whereIn('id', $ids)->delete();

        return redirect()->route('questionnaire')->with('success', 'Categories deleted successfully.');
    }
}