<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Sanctions;

class SanctionsController extends Controller{
    public function index(){
        $sanction = Sanctions::all();
        return Inertia::render('Sanctions/Sanctions', [
            'sanctions' => $sanction,
        ]);
    }

    public function destroy($id) {
        Sanctions::where('id', $id) -> delete();
        return redirect()->route('sanctions')->with('success', 'machines a été supprimé.');
    }

    public function destroyMultiple(Request $request){
        $ids = $request->input('ids');
        
        if (!is_array($ids)) {
            return Inertia::render('Sanctions/Sanctions', [
                'error' => 'Invalid data'
            ]);
        }

        Sanctions::whereIn('id', $ids)->delete();
        return Inertia::render('Sanctions/Sanctions', [
            'success' => 'Success'
        ]);
    }

    public function storeOrUpdate (Request $request){
    $validatedData = $request->validate([
        'id' => 'nullable|exists:polyvalences,id',
        'type_sanction' => 'required|string|max:255',
    ]);
    // DB::beginTransaction();
    if ($request->id) {
        // Update existing record
        // Polyvalences::where('id', $request->id)->update($validatedData);
        // dd($request-> id);
        $polyvalence = Sanctions::findOrFail($request->id);
        $polyvalence->type_sanction = $validatedData['type_sanction'];
        $polyvalence->save();
    } else {
        // Create new record
        Sanctions::create($validatedData);
    }

    return redirect()->route('sanctions')->with('success', 'machines a été ajouté.');
    }
}