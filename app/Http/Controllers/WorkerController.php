<?php

namespace App\Http\Controllers;



use App\Models\Employee;
use App\Models\Employee_contracts;
use App\Models\Departement;
use App\Models\Contarts;
use App\Models\Type_salairs;
use App\Models\Polyvalences;
use App\Models\Categories;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkerController extends Controller
{
    public function index()
    {
        $employees = Employee::all();
        $departements = Departement::with('fonctions')->get();
        $employee_contracts = Employee_contracts::all();
        $contracts = Contarts::all();
        return Inertia::render('Workers/Workers', [
            'employees' => $employees,
            'departements' => $departements,
            'employee_contracts' => $employee_contracts,
            'contractsType' => $contracts,
        ]);
    }
    public function add(){
        $employees = Employee::all();
        $departements = Departement::with('fonctions')->get();
        $contracts = Contarts::all();
        $type_salairs = Type_salairs::all();
        $polyvalences = Polyvalences::all();
        $categories = Categories::all();
        return  Inertia::render('Workers/AddWorker', [
            'employees' => $employees,
            'departements' => $departements,
            'contractsType' => $contracts,
            'type_salairs' => $type_salairs,
            'polyvalences' => $polyvalences,
            'categories' => $categories,
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


    public function addWorker(Request $request)
{
    // Validate the request data
    $validatedData = $request->validate([
        'name' => 'nullable|string|max:255',
        'birthdate' => 'nullable|date',
        'gender' => 'nullable|string',
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string',
        'email' => 'nullable|email|max:255',
        'category' => 'nullable',
        'departement' => 'nullable',
        'fonction' => 'nullable',
        'contract' => 'nullable',
        'embauche' => 'nullable|date',
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date',
        'salary_type' => 'nullable',
        'salary' => 'nullable|numeric',
        'polyvalence' => 'nullable|array', // Array of polyvalences
        'resume' => 'nullable|file',
        'document' => 'nullable|file',
        'cin' => 'nullable|file',
    ]);

    // Begin a transaction to ensure data integrity
    DB::beginTransaction();

    try {
        // Handle file uploads
        $resumePath = $request->hasFile('resume') ? $request->file('resume')->store('documents/resumes', 'public') : null;
        $documentPath = $request->hasFile('document') ? $request->file('document')->store('documents/general', 'public') : null;
        $cinPath = $request->hasFile('cin') ? $request->file('cin')->store('documents/cin', 'public') : null;

        // Create the employee
        $employee = new Employee();
        $employee->name = $validatedData['name'];
        $employee->id_societe = 1; // Assuming this is a default value or comes from elsewhere
        $employee->birthdate = $validatedData['birthdate'];
        $employee->gender = $validatedData['gender'];
        $employee->phone = $validatedData['phone'];
        $employee->address = $validatedData['address'];
        $employee->email = $validatedData['email'];
        $employee->category = $validatedData['category'];
        $employee->id_departement = $validatedData['departement'];
        $employee->id_fonction = $validatedData['fonction'];
        $employee->resume = $resumePath;
        $employee->document = $documentPath;
        $employee->cin = $cinPath;
        $employee->save();

       // Attach polyvalences to employee
       if (!empty($validatedData['polyvalence'])) {
        $employee->polyvalences()->sync($validatedData['polyvalence']);
        }

        // Create the employee contract
        $employeeContract = new Employee_contracts();
        $employeeContract->employee_id = $employee->id; // Set the employee ID
        $employeeContract->contract_id = $validatedData['contract'] ?? null;
        $employeeContract->hire_date = $validatedData['embauche'] ?? date('d-m-Y');
        $employeeContract->contract_start_date = $validatedData['start_date'] ?? date('d-m-Y');
        $employeeContract->contract_end_date = $validatedData['end_date'] ?? date('d-m-Y');
        $employeeContract->salary_type_id = $validatedData['salary_type'];
        $employeeContract->amount = $validatedData['salary'];
        $employeeContract->save();

        // Commit the transaction
        DB::commit();

        // Redirect to /workers with a success message
        return redirect('/workers')->with('success', 'Employee and contract created successfully.');
    } catch (\Exception $e) {
        // Rollback the transaction on error
        DB::rollBack();

        // Redirect back with an error message
        return redirect()->back()->withErrors(['error' => 'An error occurred: ' . $e->getMessage()])->withInput();
    }
}

}
