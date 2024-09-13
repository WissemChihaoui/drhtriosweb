<?php

namespace App\Http\Controllers;
use Inertia\Inertia;


use App\Models\Departement;
use App\Models\Employee;
use App\Models\Fonctions;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class DepartementController extends Controller{
    public function index(){
        $departements = Departement::with('fonctions')->get();

        return Inertia::render('Departements/Departements', [
            'departements' => $departements,
        ]);
    }

    public function destroy($id){
        if($id != 1){
            $departement = Departement::findOrFail($id);
            
            $undefinedDepartement = Departement::where('nom_departement', '-')->first();
            $undefinedFonction = Fonctions::where('name', '-')->first();

            if (!$undefinedDepartement || !$undefinedFonction) {
                return redirect()->route('departements')->with('error', 'Undefined department or function does not exist.');
            }

            Employee::where('id_departement', $departement->id)->update(['id_departement' => $undefinedDepartement->id]);

            $fonctionIds = Fonctions::where('id_departement', $departement->id)->pluck('id');

            Employee::whereIn('id_fonction', $fonctionIds)->update(['id_fonction' => $undefinedFonction->id]);

            Fonctions::where('id_departement', $departement->id)->delete();
            $departement->delete();

            return redirect()->route('departements')->with('success', 'Département and associated functions deleted successfully, employees reassigned.');
        };
        return redirect()->route('departements')->with('error', 'Impossible de supprimer ce champ .');
    }

    public function deleteMultiple(Request $request)
    {
        // Retrieve the array of department IDs to be deleted
        $ids = $request->input('ids');
        // dd($ids);
        
        // Check if 'ids' is an array
        if (!is_array($ids)) {
            return Inertia::render('Departements/Departements', [
                'error' => 'Invalid data'
            ]);
        }
        
        // Fetch the 'undefined' department and function (you should have created these)
        $undefinedDepartement = Departement::where('nom_departement', '-')->first();
        $undefinedFonction = Fonctions::where('name', '-')->first();

        // Ensure the 'undefined' department and function exist
        if (!$undefinedDepartement || !$undefinedFonction) {
            return redirect()->route('departements')->with('error', 'Undefined department or function does not exist.');
        }

        // Fetch all function IDs that belong to the departments being deleted
        $fonctionIds = Fonctions::whereIn('id_departement', $ids)->pluck('id')->toArray();

        // Reassign all employees from the deleted departments to the 'undefined' department and 'undefined' function
        Employee::whereIn('id_departement', $ids)
            ->update([
                'id_departement' => $undefinedDepartement->id,
                'id_fonction' => $undefinedFonction->id
            ]);

        // Reassign all employees who have a function in the deleted departments
        Employee::whereIn('id_fonction', $fonctionIds)
            ->update(['id_fonction' => $undefinedFonction->id]);

        // Now delete the functions and related departments
        Fonctions::whereIn('id_departement', $ids)->delete();
        Departement::whereIn('id', $ids)->delete();

        return Inertia::render('Departements/Departements', [
            'success' => 'Departments and associated functions deleted successfully, employees reassigned.'
        ]);
    }

    public function saveDepartement(Request $request)
{
    // Validate the request data
    $validatedData = $request->validate([
        'id' => 'nullable|exists:departements,id', // If provided, must exist in the 'departements' table
        'nom_departement' => 'required|string|max:255',
        'fonctions' => 'required|array',
        'fonctions.*.name' => 'required|string|max:255',
    ]);

    DB::beginTransaction();

    try {
        if ($request->id) {
            // Update the existing department
            $departement = Departement::findOrFail($request->id);
            $departement->nom_departement = $validatedData['nom_departement'];
            $departement->save();
            // Delete all existing fonctions for this department
            Fonctions::where('id_departement', $departement->id)->delete();

            // Insert new fonctions from the request
            foreach ($validatedData['fonctions'] as $fonctionData) {
                $fonction = new Fonctions();
                $fonction->name = $fonctionData['name'];
                $fonction->id_departement = $departement->id;
                $fonction->id_societe = $departement->id_societe; // Assuming the department's societe ID is used
                $fonction->save();
            }
        } else {
            // Create new department
            $departement = new Departement();
            $departement->nom_departement = $validatedData['nom_departement'];
            $departement->id_societe = 1; // Assuming this comes from the company context
            $departement->save();

            // Create new fonctions associated with this department
            foreach ($validatedData['fonctions'] as $fonctionData) {
                $fonction = new Fonctions();
                $fonction->name = $fonctionData['name'];
                $fonction->id_departement = $departement->id;
                $fonction->id_societe = $departement->id_societe;
                $fonction->save();
            }
        }

        DB::commit();

        return redirect()->back()->with('success', 'Department and functions saved successfully.');
    } catch (\Exception $e) {
        DB::rollBack();

        return redirect()->back()->withErrors(['error' => 'An error occurred: ' . $e->getMessage()]);
    }
}

}