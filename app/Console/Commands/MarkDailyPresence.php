<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Employee;
use App\Models\Employee_contracts;
use Illuminate\Support\Facades\DB;

class MarkDailyPresence extends Command
{
    protected $signature = 'presence:mark';
    protected $description = 'Mark daily presence for all employees and store in a monthly record with "01-MM-YYYY"';

    public function handle()
    {
        $workers = Employee::all();
        $today = today();
        $month = $today->format('01-m-Y'); 
        $day = $today->format('d-m-Y'); 

        foreach ($workers as $worker) {
            $presenceRecord = DB::table('emp_presents')
                ->where('employee_id', $worker->id)
                ->where('month', $month) 
                ->first();
            $salary_type = Employee_contracts::where('employee_id', $worker -> id)->first();
            // dd($salary_type->salary_type_id);
            $shift = $salary_type->salary_type_id === 1 ? 1 : 3;
            $hours = $salary_type->salary_type_id === 1 ? null : 8.5;

            if (!$presenceRecord) {
                DB::table('emp_presents')->insert([
                    'employee_id' => $worker->id,
                    'month' => $month, 
                    'presence_data' => json_encode([]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $presenceRecord = DB::table('emp_presents')
                    ->where('employee_id', $worker->id)
                    ->where('month', $month)
                    ->first();
            }

            $presenceData = json_decode($presenceRecord->presence_data, true) ?? [];

            $presenceData[$day] = [
                'status' => 1,
                'shift' => $shift,
                'hours' => $hours,
                'conge_id' => null,
                'raison' => null,
                'action' => 1,
            ];

            DB::table('emp_presents')
                ->where('id', $presenceRecord->id)
                ->update([
                    'presence_data' => json_encode($presenceData),
                    'updated_at' => now(),
                ]);
        }

        $this->info('Daily presence marked for all employees.');
    }
}
