<?php
namespace App\Http\Controllers;


use App\Models\Polyvalences;
use App\Models\Employee;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PolyvalencesController extends Controller{
    public function index()
    {
        // Fetch employees and their associated polyvalences
        $employeesWithPolyvalences = Employee::with('polyvalences')
            ->whereHas('polyvalences') // Only include employees with polyvalences
            ->get();

        return Inertia::render('Polyvalences/Polyvalences', [
            'employeesWithPolyvalences' => $employeesWithPolyvalences,
        ]);
    }

    public function machines()
{
    // Get all polyvalences with a count of employees associated with each one
    $polyvalences = Polyvalences::withCount('employees')->get();
    // dd($polyvalences);
    return Inertia::render('Polyvalences/Machines', [
        'machines' => $polyvalences,
    ]);
}


    public function deleteMachine($id) {
        Polyvalences::where('id', $id)->delete();
        return redirect()->route('machines')->with('success', 'machines a été supprimé.');
    }
    public function deleteMachines(Request $request){
        
        $ids = $request->input('ids');
        // dd($ids);
        
        // Check if 'ids' is an array
        if (!is_array($ids)) {
            return Inertia::render('Polyvalences/Machines', [
                'error' => 'Invalid data'
            ]);
        }

        Polyvalences::whereIn('id', $ids)->delete();
        return Inertia::render('Polyvalences/Machines', [
            'success' => 'Success'
        ]);
    }
    public function storeOrUpdate(Request $request)
{
    // dd($request->all());
    // Validate the request
    $validatedData = $request->validate([
        'id' => 'nullable|exists:polyvalences,id',
        'name' => 'required|string|max:255',
    ]);
    // DB::beginTransaction();
    if ($request->id) {
        // Update existing record
        // Polyvalences::where('id', $request->id)->update($validatedData);
        $polyvalence = Polyvalences::findOrFail($request->id);
        $polyvalence->name = $validatedData['name'];
        $polyvalence->save();
    } else {
        // Create new record
        Polyvalences::create($validatedData);
    }

    return redirect()->route('machines')->with('success', 'machines a été ajouté.');
}

}