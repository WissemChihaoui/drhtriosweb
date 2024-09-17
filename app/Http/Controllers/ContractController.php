<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


use App\Models\Contarts;

class ContractController extends Controller {
    public function index() {
        $contracts = Contarts::all();
        return Inertia::render('Settings/Contracts/Contracts', [
            'contracts' => $contracts,
        ]);
    }

    public function destroy($id) {
        Contarts::where('id', $id) -> delete();
        return redirect()->route('contracts')->with('success', 'catégorie a été supprimé.');
    }

    public function destroyMultiple(Request $request){
        $ids = $request->input('ids');
        
        if (!is_array($ids)) {
            return Inertia::render('Settings/Contracts/Contracts', [
                'error' => 'Invalid data'
            ]);
        }

        Contarts::whereIn('id', $ids)->delete();

        return redirect()->route('contracts')->with('success', 'Contracts deleted successfully.');
    }

    public function storeOrUpdate (Request $request){
        $validatedData = $request->validate([
            'id' => 'nullable|exists:contarts,id',
            'name' => 'required|string|max:255',
        ]);
        // DB::beginTransaction();
        if ($request->id) {
            // Update existing record
            // Polyvalences::where('id', $request->id)->update($validatedData);
            // dd($request-> id);
            $contracts = Contarts::findOrFail($request->id);
            $contracts->name = $validatedData['name'];
            $contracts->save();
        } else {
            // Create new record
            Contarts::create($validatedData);
        }
    
        return redirect()->route('contracts')->with('success', 'catégorie a été ajouté.');
        
    }
}