<?php
namespace App\Http\Controllers;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Emp_presents;
use App\Models\Departement;
use App\Models\Questionnaires;
use App\Models\Employee;
use App\Models\Employee_contracts;

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
                            'reason' => $reason,
                        ];
                    }
                }
            }
        }

        $totalEmployees = $employees->count();
        $percentageAbsent = $totalEmployees > 0 
            ? round(($absentCount / $totalEmployees) * 100, 2) 
            : 0;

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
    [$day,$month, $year] = explode('-', $monthYear);

    $startDate = Carbon::createFromFormat('d-m-Y', "01-$month-$year")->startOfDay();
    $endDate = $startDate->copy()->endOfMonth(); 
    $employees = Employee::with('contarts')->get();
    
    $dataGender = [
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

    foreach ($employees as $employee) {
        $age = Carbon::parse($employee->birthdate)->age; 
        $gender = $employee->gender;

        foreach ($employee->contarts as $contract) {
            $contractStart = Carbon::parse($contract->contract_start_date)->startOfDay();
            $contractEnd = Carbon::parse($contract->contract_end_date)->endOfDay();
            if ($contractStart >= $startDate || $contractEnd <= $endDate ) {
                if ($age >= 18 && $age <= 25) {
                    $dataGender[$gender]['18-25']++;
                } elseif ($age >= 26 && $age <= 35) {
                    $dataGender[$gender]['26-35']++;
                } elseif ($age >= 36 && $age <= 45) {
                    $dataGender[$gender]['36-45']++;
                } else {
                    $dataGender[$gender]['46+']++;
                }

        
                break;
            }
        }
    }

   
    $formattedMonth = sprintf('01-%02d-%s', $month, $year);

    $departments = Departement::with('employees.emp_presents')->get();
    
    $absenceData = [];

    foreach ($departments as $department) {
        $totalEmployees = 0;
        $totalAbsences = 0;

        foreach ($department->employees as $employee) {
            foreach ($employee->emp_presents as $empPresent) {
                
                if ($empPresent->month == $startDate->format('d-m-Y')) {
                    $presenceData = json_decode($empPresent->presence_data, true)??[];
                    $daysInMonth = count($presenceData);
                    $absentDays = 0;

                    // Calculate total absent days
                    foreach ($presenceData as $day => $data) {
                        if ($data['status'] == 0) {
                            $absentDays++;
                        }
                    }

                    $totalEmployees++;
                    $totalAbsences += $absentDays / $daysInMonth; // Get absence percentage for the employee
                }
            }
        }

        if ($totalEmployees > 0) {
            $absencePercentage = ($totalAbsences / $totalEmployees) * 100;
        } else {
            $absencePercentage = 0;
        }

        $absenceData[] = [
            'department' => $department->nom_departement,
            'absencePercentage' => $absencePercentage,
        ];
    }
    
    return Inertia::render('Documentation/Partials/documentsGen/EmployeeStatistics', [
        'date' => $formattedMonth,
        'employeeData' => $dataGender,
        'absenceData' => $absenceData
    ]);
}
public function getRotationStatistics($monthYear){
    [$day,$month, $year] = explode('-', $monthYear);
    $contracts = Employee_contracts::whereYear('hire_date', '=', $year)
    ->orWhereYear('contract_end_date', '=', $year)
    ->get()
    ->groupBy('employee_id');

    $employeesJoined = [];
    $employeesLeft = [];

    for ($month = 1; $month <= 12; $month++) {
        $employeesJoined[$month] = 0;
        $employeesLeft[$month] = 0;
    }

    foreach ($contracts as $employeeContracts) {
        $firstHireDate = $employeeContracts->min('hire_date'); 
        $lastContractEndDate = $employeeContracts->max('contract_end_date');

        $hireDate = Carbon::parse($firstHireDate);
        $contractEndDate = Carbon::parse($lastContractEndDate);

        if ($hireDate->year == $year) {
            $employeesJoined[$hireDate->month]++;
        }

        if ($contractEndDate->year == $year) {
            $employeesLeft[$contractEndDate->month]++;
        }
    }

    // dd($monthYear);
    return Inertia::render('Documentation/Partials/documentsGen/RotationRapport', [
        'monthYear' => $monthYear,
        'employeesLeft' => $employeesLeft,
        'employeesJoined' => $employeesJoined,
    ]);
}





}
