<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


use App\Models\Conges;

class CongesController extends Controller {
    public function index() {
        $conges = Conges::all();
        return Inertia::render('Settings/Conges/Conges', [
            'conges' => $conges,
        ]);
    }

    public function destroy($id) {
        Conges::where('id', $id) -> delete();
        return redirect()->route('conges')->with('success', 'congé a été supprimé.');
    }

    public function destroyMultiple(Request $request){
        $ids = $request->input('ids');
        
        if (!is_array($ids)) {
            return Inertia::render('Settings/Conges/Conges', [
                'error' => 'Invalid data'
            ]);
        }

        Conges::whereIn('id', $ids)->delete();

        return redirect()->route('conges')->with('success', 'Conges deleted successfully.');
    }

    public function storeOrUpdate (Request $request){
        $validatedData = $request->validate([
            'id' => 'nullable|exists:conges,id',
            'nom_conge' => 'required|string|max:255',
        ]);
        // dd($request->all());
        // DB::beginTransaction();
        if ($request->id) {
            // Update existing record
            // Polyvalences::where('id', $request->id)->update($validatedData);
            // dd($request-> id);
            $conges = Conges::findOrFail($request->id);
            $conges->nom_conge = $validatedData['nom_conge'];
            $conges->save();
        } else {
            // Create new record
            Conges::create($validatedData);
        }
    
        return redirect()->route('conges')->with('success', 'congé a été ajouté.');
        
    }
}