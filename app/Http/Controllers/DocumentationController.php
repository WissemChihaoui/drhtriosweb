<?php
namespace App\Http\Controllers;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Emp_presents;
use App\Models\Departement;
use App\Models\Questionnaires;
use App\Models\Employee;

class DocumentationController extends Controller{
    
    public function index(){
        return Inertia::render('Documentation/Documentation');
    }

    public function rapportJournalier($dateQuery)
{
    // Get the month and year from dateQuery (assuming format is dd-mm-yyyy)
    $month = date('m', strtotime($dateQuery));
    $year = date('Y', strtotime($dateQuery));

    // Get all departments with their employees
    $departments = Departement::with('employees')->get();
    $departmentAttendanceData = [];
    $absentEmployees = []; // Array to store the list of absent employees with reasons

    // Get attendance records for the given month and year in one query
    $empPresents = Emp_presents::where('month', '01-' . $month . '-' . $year)
                                ->get()
                                ->keyBy('employee_id');

    foreach ($departments as $departement) {
        $employees = $departement->employees;
        $presentCount = 0;
        $absentCount = 0;

        foreach ($employees as $employee) {
            if (isset($empPresents[$employee->id])) {
                $presenceData = json_decode($empPresents[$employee->id]->presence_data, true);
                // dd($presenceData[$dateQuery]['raison']); 

                // Check attendance status for the specific date
                if (isset($presenceData[$dateQuery])) {
                    $status = $presenceData[$dateQuery]['status'];
                    if ($status == 1) {
                        $presentCount++;
                    } elseif ($status == 0) {
                        $absentCount++;
                        
                        // Capture the reason for absence if it exists
                        $reason =$presenceData[$dateQuery]['raison'] ;

                        // Add absent employee to the list along with the reason
                        $absentEmployees[] = [
                            'employee_id' => $employee->id,
                            'employee_name' => $employee->name,
                            'departement' => $departement->nom_departement,
                            'reason' => $reason, // Include the reason for absence
                        ];
                    }
                }
            }
        }

        // Calculate absenteeism percentage for the department
        $totalEmployees = $employees->count();
        $percentageAbsent = $totalEmployees > 0 
            ? round(($absentCount / $totalEmployees) * 100, 2) 
            : 0;

        // Store department attendance data
        $departmentAttendanceData[] = [
            'departement' => $departement->nom_departement,
            'percentageAbsent' => $percentageAbsent,
            'presentCount' => $presentCount,
            'absentCount' => $absentCount,
        ];
    }

    // Helper functions to count employees present/absent on a specific date
    function countEmployeesOnDate($empPresents, $dateQuery, $status)
    {
        $count = 0;
        foreach ($empPresents as $record) {
            $presenceData = json_decode($record->presence_data, true);
            if (isset($presenceData[$dateQuery]) && $presenceData[$dateQuery]['status'] === $status) {
                $count++;
            }
        }
        return $count;
    }

    // Count total employees present and absent on the given date
    $numberOfEmployeesPresent = countEmployeesOnDate($empPresents, $dateQuery, 1);
    $numberOfEmployeesAbsent = countEmployeesOnDate($empPresents, $dateQuery, 0);
    $datefmt = date('Y-m-d', strtotime($dateQuery));

    $questionnaires = Questionnaires::whereDate('created_at', '=', $datefmt)->with('sanctions','employee')->get();
    // Return the data to the frontend
    return Inertia::render('Documentation/Partials/documentsGen/RapportJournalier', [
        'date' => $dateQuery,
        'departmentAttendanceData' => $departmentAttendanceData,
        'numberOfEmployeesPresent' => $numberOfEmployeesPresent,
        'numberOfEmployeesAbsent' => $numberOfEmployeesAbsent,
        'absentEmployees' => $absentEmployees, // Return the absent employees with reasons
        'questionnaires' => $questionnaires,
    ]);
}

public function getEmployeeStatistics($monthYear)
{
    // Parse the provided month and year
    [$year, $month] = explode('-', $monthYear);

    // Get the start and end date of the month (dd-mm-yyyy)
    $startDate = Carbon::createFromFormat('d-m-Y', "01-$month-$year")->startOfDay();
    $endDate = $startDate->copy()->endOfMonth(); // Get the last day of the month

    // Fetch all employees with their contracts
    $employees = Employee::with('contarts')->get();
    
    // Initialize arrays to categorize employees
    $data = [
        'Homme' => [
            '18-25' => 0,
            '26-35' => 0,
            '36-45' => 0,
            '46+' => 0,
        ],
        'Femme' => [
            '18-25' => 0,
            '26-35' => 0,
            '36-45' => 0,
            '46+' => 0,
        ],
    ];

    // Iterate through employees and their contracts
    foreach ($employees as $employee) {
        $age = Carbon::parse($employee->birthdate)->age; // Assuming birthdate field
        $gender = $employee->gender;

        // Check if any of their contracts fall within the month
        foreach ($employee->contarts as $contract) {
            $contractStart = Carbon::parse($contract->contract_start_date)->startOfDay();
            $contractEnd = Carbon::parse($contract->contract_end_date)->endOfDay();
            // dd($contractStart);
            // Verify if the contract is active during the selected month
            if ($contractStart >= $startDate || $contractEnd <= $endDate ) {
                // Categorize the employee based on age and gender
                if ($age >= 18 && $age <= 25) {
                    $data[$gender]['18-25']++;
                } elseif ($age >= 26 && $age <= 35) {
                    $data[$gender]['26-35']++;
                } elseif ($age >= 36 && $age <= 45) {
                    $data[$gender]['36-45']++;
                } else {
                    $data[$gender]['46+']++;
                }

                // No need to check further contracts for this employee once counted
                break;
            }
        }
    }
    // dd($data);
    // Return data to the frontend
    return Inertia::render('Documentation/Partials/documentsGen/EmployeeStatistics', [
        'employeeData' => $data,
    ]);
}






}
