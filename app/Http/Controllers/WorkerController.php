<?php

namespace App\Http\Controllers;



use App\Models\Employee;
use Inertia\Inertia;
use Illuminate\Http\Request;

class WorkerController extends Controller
{
    public function index()
    {
        $employees = Employee::all();
        return Inertia::render('Workers/Workers', [
            'employees' => $employees,
        ]);
    }
    public function add(){
        $employees = Employee::all();
        return  Inertia::render('Workers/AddWorker', [
            'employees' => $employees,
        ]);
    }
    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);

        if ($employee) {
            $employee->delete();
            return redirect()->route('workers')->with('success', 'Employee deleted successfully.');
        }

        return redirect()->route('workers')->with('error', 'Employee not found.');
    }

    public function deleteMultiple(Request $request)
{ 
    $ids = $request->input('ids');
    if (!is_array($ids)) {
        
        return Inertia::render('Workers/Workers', [
            'error' => 'Invalid data'
        ]);
    }
    
    Employee::whereIn('id', $ids)->delete();

    return Inertia::render('Workers/Workers', [
        'success' => 'Employees deleted successfully.'
    ]);
}


public function addWorker(Request $request){
    
    {
        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255',
            'birthdate' => 'nullable|date',
            'gender' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'category' => 'nullable',
            'department' => 'nullable',
            'fonction' => 'nullable',
            'contract' => 'nullable',
            'embauche' => 'nullable|date',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'salary_type' => 'nullable',
            'salary' => 'nullable|numeric',
            'polyvalence' => 'array',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'document' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'cin' => 'nullable|file|mimes:png,jpg,jpeg|max:2048',
        ]);

        if ($request->hasFile('resume')) {
            $resumePath = $request->file('resume')->store('documents/resumes', 'public');
        }

        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('documents/general', 'public');
        }

        if ($request->hasFile('cin')) {
            $cinPath = $request->file('cin')->store('documents/cin', 'public');
        }

        $employee = new Employee();
        $employee->name = $validatedData['name'];
        $employee->birthdate = $validatedData['birthdate'];
        $employee->gender = $validatedData['gender'];
        $employee->phone = $validatedData['phone'];
        $employee->address = $validatedData['address'];
        $employee->email = $validatedData['email'];
        $employee->category = $validatedData['category']['code']; 
        $employee->department = $validatedData['department']['code'];
        $employee->fonction = $validatedData['fonction']['code'];
        $employee->contract = $validatedData['contract']['code'];
        $employee->embauche = $validatedData['embauche'];
        $employee->start_date = $validatedData['start_date'];
        $employee->end_date = $validatedData['end_date'];
        $employee->salary_type = $validatedData['salary_type']['code'];
        $employee->salary = $validatedData['salary'];

        $employee->resume = $resumePath ?? null;
        $employee->document = $documentPath ?? null;
        $employee->cin = $cinPath ?? null;

        $employee->polyvalence = json_encode($validatedData['polyvalence']);

        $employee->save();

        return redirect()->route('workers')->with('success', 'Employee created successfully.');
    }
}

}
