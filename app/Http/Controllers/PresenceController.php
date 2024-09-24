<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Emp_presents;
use App\Models\Conges;

class PresenceController extends Controller {
    public function index(){
        $presences = Emp_presents::with('employee')->get();
        $conges = Conges::all();
        // dd($conges);
        return Inertia::render('Presences/Presences', [
            'presences' => $presences,
            'conges' => $conges,
        ]);
    }

    public function createPresencePage(){
        $presences = Emp_presents::select('emp_presents.*', 'type_salairs.type as typesalaire')->with('employee')
        ->leftJoin('employee_contracts', 'employee_contracts.employee_id', 'emp_presents.employee_id')
        ->leftJoin('type_salairs', 'type_salairs.id', 'employee_contracts.salary_type_id')
        
        ->get();
        $conges = Conges::all();

        return Inertia::render('Presences/CreatePresence', [
            'presences' => $presences,
            'conges' => $conges,
        ]);
    }

    public function createPresencePageCustomDate($date){
        dd($date);
    }

    public function submitPresence($date, Request $request){
        $presences = $request -> all();
        foreach ($presences['presences'] as $presence) {
            $employee_id = $presence['employee_id'];
            $date = $presence['date'];
            
            // Find the Emp_presents record for the employee and month
            $empPresent = Emp_presents::where('employee_id', $employee_id)
                ->where('month', $presence['month'])
                ->first();
        
            if ($empPresent) {
                // Decode the existing JSON data in presence_data
                $presenceData = json_decode($empPresent->presence_data, true);
        
                // Update or add the presence data for the specific date
                $presenceData[$date] = [
                    'status' => $presence['status'],
                    'shift' => $presence['shift'],
                    'hours' => $presence['hours'],
                    'conge_id' => $presence['conge_id'],
                    'raison' => $presence['raison']
                ];
        
                // Encode the updated data back to JSON
                $empPresent->presence_data = json_encode($presenceData);
        
                // Save the updated record
                $empPresent->save();
            }
        }
    }

    public function editPresence($id, Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'date' => 'required|date_format:d-m-Y',
            'status' => 'required|integer',
            'shift' => 'nullable|integer', // Making shift nullable
            'hours' => 'nullable|numeric',
            'conge_id' => 'nullable|integer', // Making conge_id nullable
            'action' => 'required|integer',
            'raison' => 'nullable|string', // Making raison nullable
        ]);
    
        // Find the Emp_present record by its ID
        $empPresent = Emp_presents::find($id);
    
        if (!$empPresent) {
            return response()->json(['message' => 'Record not found'], 404);
        }
    
        // Decode the existing presence_data JSON
        $presenceData = json_decode($empPresent->presence_data, true);
    
        // Update the data for the specific date
        $presenceData[$validatedData['date']] = [
            'status' => $validatedData['status'],
            'shift' => $validatedData['shift'] ?? null, // Use null if not provided
            'hours' => $validatedData['hours'] ?? null,
            'conge_id' => $validatedData['conge_id'] ?? null, // Use null if not provided
            'action' => $validatedData['action'],
            'raison' => $validatedData['raison'] ?? null, // Use null if not provided
        ];
    
        // Re-encode the updated presence_data and save it
        $empPresent->presence_data = json_encode($presenceData);
        $empPresent->save();
    
        // Redirect with success message
        return redirect()->route('presence')->with('success', 'Présence modifiée avec succès');
    }
    

}
