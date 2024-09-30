<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Contarts;
use App\Models\Employee;
use App\Models\Emp_presents;
use App\Models\Categories;
use App\Models\Departement;


class DashboardController extends Controller{
    
    public function index(){

        function countEmployeesPresentOnDate($empPresents) {
            $presentCount = 0;
        
            $targetDate = date('d-m-Y');
        
            foreach ($empPresents as $record) {
                $presenceData = json_decode($record['presence_data'], true);
                
                if (isset($presenceData[$targetDate])) {
                    $data = $presenceData[$targetDate];
        
                    if ($data['status'] === 1) {
                        $presentCount++;
                    }
                }
            }
        
            return $presentCount;
        }

        $presents = Emp_presents::with('employee')->get();
        // dd($presents);
        $numberOfEmployeesPresent = countEmployeesPresentOnDate($presents);
        $employees = Employee::get();
        $categories = Categories::get();
        $departments = Departement::get();
        return Inertia::render('Dashboard', [
            'numberOfEmployeesPresent' => $numberOfEmployeesPresent,
            'employees' => $employees,
            'categories' => $categories,
            'presents' => $presents,
            'departments' => $departments,
            
        ]);
    }
}