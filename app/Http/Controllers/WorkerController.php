<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\Validator; // Import the Validator facade
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
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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

        return redirect()->route('workers')->with('success', 'Employee deleted successfully.');
    }


    public function addWorker(Request $request)
{
    // Check the incoming data

    $validatedData = $request->validate([
        'name' => 'nullable|string|max:255',
        'birthdate' => 'nullable|date',
        'gender' => 'nullable|string',
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string',
        'email' => 'nullable|email|max:255',
        'employeeID' => 'nullable',
        'category' => 'nullable',
        'departement' => 'nullable',
        'fonction' => 'nullable',
        'contract' => 'nullable',
        'embauche' => 'nullable|date',
        'exit_date' => 'nullable|date',
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date',
        'salary_type' => 'nullable',
        'salary' => 'nullable|numeric',
        'polyvalence' => 'nullable|array',
        'resume' => 'nullable|file',
        'document' => 'nullable|file',
        'cin' => 'nullable|file',
    ]);

   // Set and format dates using Carbon (with GMT+1 timezone)
$gmtPlusOne = 'Europe/Paris'; // You can use the 'Europe/Paris' time zone, which corresponds to GMT+1

$validatedData['birthdate'] = isset($validatedData['birthdate']) 
    ? Carbon::parse($validatedData['birthdate'])->setTimezone($gmtPlusOne)->format('Y-m-d') 
    : null;

$validatedData['embauche'] = isset($validatedData['embauche']) 
    ? Carbon::parse($validatedData['embauche'])->setTimezone($gmtPlusOne)->format('Y-m-d') 
    : null;

$validatedData['start_date'] = isset($validatedData['start_date']) 
    ? Carbon::parse($validatedData['start_date'])->setTimezone($gmtPlusOne)->format('Y-m-d') 
    : null;

$validatedData['end_date'] = isset($validatedData['end_date']) 
    ? Carbon::parse($validatedData['end_date'])->setTimezone($gmtPlusOne)->format('Y-m-d') 
    : null;

$validatedData['exit_date'] = isset($validatedData['exit_date']) 
    ? Carbon::parse($validatedData['exit_date'])->setTimezone($gmtPlusOne)->format('Y-m-d') 
    : null;

    // Debug to verify the formatted dates
    // dd($validatedData);

    DB::beginTransaction();

    try {
        $resumePath = $request->hasFile('resume') ? $request->file('resume')->store('documents/resumes', 'public') : null;
        $documentPath = $request->hasFile('document') ? $request->file('document')->store('documents/general', 'public') : null;
        $cinPath = $request->hasFile('cin') ? $request->file('cin')->store('documents/cin', 'public') : null;

        // Create the employee
        $employee = new Employee();
        $employee->name = $validatedData['name'];
        $employee->id_societe = 1;
        $employee->birthdate = $validatedData['birthdate'];
        $employee->gender = $validatedData['gender'];
        $employee->phone = $validatedData['phone'];
        $employee->address = $validatedData['address'];
        $employee->email = $validatedData['email'];
        $employee->employeeID = $validatedData['employeeID'];
        $employee->category_id = $validatedData['category'];
        $employee->id_departement = $validatedData['departement'];
        $employee->id_fonction = $validatedData['fonction'];
        $employee->hire_date = $validatedData['embauche'];
        $employee->exit_date = $validatedData['exit_date'];
        $employee->resume = $resumePath;
        $employee->document = $documentPath;
        $employee->cin = $cinPath;
        $employee->save();

        // Sync polyvalence
        if (!empty($validatedData['polyvalence'])) {
            $employee->polyvalences()->sync($validatedData['polyvalence']);
        }

        // Create the employee contract
        $employeeContract = new Employee_contracts();
        $employeeContract->employee_id = $employee->id;
        $employeeContract->contract_id = $validatedData['contract'] ?? null;
        $employeeContract->contract_start_date = $validatedData['start_date'];
        $employeeContract->contract_end_date = $validatedData['end_date'];
        $employeeContract->salary_type_id = $validatedData['salary_type'];
        $employeeContract->amount = $validatedData['salary'];
        $employeeContract->save();

        DB::commit();

        return redirect('/workers')->with('success', 'Employee and contract created successfully.');
    } catch (\Exception $e) {
        DB::rollBack();
        return redirect()->back()->withErrors(['error' => 'An error occurred: ' . $e->getMessage()])->withInput();
    }
}

    public function edit($id)
    {
        $employee = Employee::with(['polyvalences'])
                        ->where('id', $id)
                        ->firstOrFail();
        $departements = Departement::with('fonctions')->get();
        // dd($departements);
        $contracts = Contarts::all();
        $type_salairs = Type_salairs::all();
        $polyvalences = Polyvalences::all();
        $categories = Categories::all();
        $employee_contracts = Employee_contracts::where('employee_id', $id)->get();
        return Inertia::render('Workers/EditWorker', [
            'employee' => $employee,
            'departements' => $departements,
            'contractsType' => $contracts,
            'type_salairs' => $type_salairs,
            'polyvalences' => $polyvalences,
            'categories' => $categories,
            'employee_contracts' => $employee_contracts,
        ]);
    }

    public function editWorker(Request $request, $id)
{
    // Validate the incoming data
    $validatedData = $request->validate([
        'name' => 'nullable|string|max:255',
        'birthdate' => 'nullable|date',
        'gender' => 'nullable|string',
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string',
        'email' => 'nullable|email|max:255',
        'status' => 'nullable|max:255',
        'employeeID' => 'nullable',
        'category' => 'nullable',
        'departement' => 'nullable',
        'fonction' => 'nullable',
        'contract' => 'nullable',
        'embauche' => 'nullable|date',
        'exit_date' => 'nullable|date',
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
    // dd($request->all());
    try {
        // Fetch the existing employee by ID
        $employee = Employee::findOrFail($id);

        // Handle file uploads
        $resumePath = $request->hasFile('resume') ? $request->file('resume')->store('documents/resumes', 'public') : $employee->resume;
        $documentPath = $request->hasFile('document') ? $request->file('document')->store('documents/general', 'public') : $employee->document;
        $cinPath = $request->hasFile('cin') ? $request->file('cin')->store('documents/cin', 'public') : $employee->cin;

        // Update employee details
        $employee->name = $validatedData['name'] ?? $employee->name;
        $employee->birthdate = $validatedData['birthdate'] ?? $employee->birthdate;
        $employee->gender = $validatedData['gender'] ?? $employee->gender;
        $employee->status = $validatedData['status'] ?? $employee->status;
        $employee->phone = $validatedData['phone'] ?? $employee->phone;
        $employee->address = $validatedData['address'] ?? $employee->address;
        $employee->email = $validatedData['email'] ?? $employee->email;
        $employee->employeeID = $validatedData['category'] ?? $employee->employeeID;
        $employee->category_id = $validatedData['category'] ?? $employee->category_id;
        $employee->id_departement = $validatedData['departement'] ?? $employee->id_departement;
        $employee->id_fonction = $validatedData['fonction'] ?? $employee->id_fonction;
        $employee->hire_date = $validatedData['embauche'] ?? $employee->hire_date;
        $employee->exit_date = $validatedData['exit_date'] ?? $employee->exit_date;
        $employee->resume = $resumePath;
        $employee->document = $documentPath;
        $employee->cin = $cinPath;
        $employee->save();

        
        $employee->polyvalences()->sync($request->polyvalences);
        $employeeContract = Employee_contracts::where('employee_id', $employee->id)->first();

        if ($employeeContract) {
            // Update the contract details
            $employeeContract->contract_id = $validatedData['contract'] ?? $employeeContract->contract_id;
            $employeeContract->contract_start_date = $validatedData['start_date'] ?? $employeeContract->contract_start_date;
            $employeeContract->contract_end_date = $validatedData['end_date'] ?? $employeeContract->contract_end_date;
            $employeeContract->salary_type_id = $validatedData['salary_type'] ?? $employeeContract->salary_type_id;
            $employeeContract->amount = $validatedData['salary'] ?? $employeeContract->amount;
            $employeeContract->save();
        } else {
            return redirect()->back()->withErrors(['error' => 'Contract not found for this employee.']);
        }
        DB::commit();
        return redirect('/workers')->with('success', 'Employee and contract updated successfully.');
    } catch (\Exception $e) {
        DB::rollBack();
        return redirect()->back()->withErrors(['error' => 'An error occurred: ' . $e->getMessage()])->withInput();
    }
}

public function pushCsv(Request $request)
{
    $employeesData = $request->all();
    // dd($employeesData);
    try {
        foreach ($employeesData as $data) {
            log::info('Creating employee with data: ', $data);

            // Create Employee
            $employee = new Employee();
            $employee->name = $data['name'] ?? null;
            $employee->birthdate = isset($data['birthdate']) ? Carbon::createFromFormat('d/m/Y', $data['birthdate'])->format('Y-m-d') : null;
            $employee->gender = $data['gender'] ?? null;
            $employee->phone = $data['phone'] ?? null;
            $employee->address = $data['address'] ?? null;
            $employee->email = $data['email'] === "NULL" ? null : $data['email'];
            $employee->employeeID = $data['employeeID'] ?? null;
            $employee->category_id = $data['category_id'] ?? null;
            $employee->id_departement = $data['id_departement'] ?? null;
            $employee->id_fonction = $data['id_fonction'] ?? null;
            $employee->status = $data['status'] ?? null;
            $employee->commentaire = $data['commentaire'] ?? null;
            $employee->hire_date = isset($data['hire_date']) ? $this->parseDate($data['hire_date']) : null;
            $employee->exit_date = isset($data['exit_date']) ? $this->parseDate($data['exit_date']) : null;
            $employee->resume = null;
            $employee->document = null;
            $employee->cin = null;
            $employee->save();

            log::info('Employee created with ID: ' . $employee->id);

            // Create Employee Contract
            $employeeContract = new Employee_contracts();
            $employeeContract->employee_id = $employee->id ?? null;
            $employeeContract->contract_id = $data['contract_id'] ?? null;
            
            // Date Handling for Contract
            $employeeContract->contract_start_date = isset($data['contract_start_date']) ? $this->parseDate($data['contract_start_date']) : null;
            $employeeContract->contract_end_date = isset($data['contract_end_date']) ? $this->parseDate($data['contract_end_date']) : null;
           

            // Salary Info
            $employeeContract->salary_type_id = $data['salary_type_id'] ?? null;
            $employeeContract->amount = $data['amount'] ?? null;

            $employeeContract->save();
            log::info('Contract created for employee ID: ' . $employee->id);
        }

        return redirect()->route('workers')->with('success', 'Employees have been added.');
    } catch (\Exception $e) {
        DB::rollBack(); // Rollback the transaction on error
        log::error('Error occurred while adding employees: ' . $e->getMessage());
        return redirect()->back()->withErrors(['error' => 'An error occurred: ' . $e->getMessage()])->withInput();
    }
}

/**
 * Helper function to parse date safely.
 */
private function parseDate($date)
{
    try {
        return Carbon::createFromFormat('d/m/Y', $date)->format('Y-m-d');
    } catch (\Exception $e) {
        log::warning('Invalid date format: ' . $date);
        return null;  // Return null if date is invalid
    }
}


public function addContract(Request $request, $id)
{
    // Validate the incoming request data
    $validatedData = $request->validate([
        'embauche' => 'required|date',
        'start_date' => 'required|date',
        'end_date' => 'required|date',
        'contract' => 'required|integer',
        'salary_type' => 'required|integer',
        'salary' => 'required|numeric',
    ]);

    // Start a database transaction
    DB::beginTransaction();

    try {
        // Find the employee by their ID
        $employee = Employee::findOrFail($id);

        // Create a new Employee Contract
        $employeeContract = new Employee_contracts();
        $employeeContract->employee_id = $employee->id;
        $employeeContract->contract_id = $validatedData['contract'];
        $employeeContract->contract_start_date = $validatedData['start_date'];
        $employeeContract->contract_end_date = $validatedData['end_date'];
        $employeeContract->salary_type_id = $validatedData['salary_type'];
        $employeeContract->amount = $validatedData['salary'];
        $employeeContract->save();
        DB::commit();
        return redirect()->route('workers')->with('success', 'Employee deleted successfully.');
    } catch (\Exception $e) {
        DB::rollBack();
        return redirect()->route('workers')->with('error', 'Employee deleted successfully.');
    }
}






}
