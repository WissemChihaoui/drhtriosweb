<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


use App\Models\Categories;

class CategoriesController extends Controller {
    public function index() {
        $categories = Categories::all();
        return Inertia::render('Settings/Categories/Categories', [
            'categories' => $categories,
        ]);
    }

    public function destroy($id) {
        Categories::where('id', $id) -> delete();
        return redirect()->route('categories')->with('success', 'catégorie a été supprimé.');
    }

    public function destroyMultiple(Request $request){
        $ids = $request->input('ids');
        
        if (!is_array($ids)) {
            return Inertia::render('Settings/Categories/Categories', [
                'error' => 'Invalid data'
            ]);
        }

        Categories::whereIn('id', $ids)->delete();

        return redirect()->route('categories')->with('success', 'Categories deleted successfully.');
    }

    public function storeOrUpdate (Request $request){
        $validatedData = $request->validate([
            'id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
        ]);
        // DB::beginTransaction();
        if ($request->id) {
            // Update existing record
            // Polyvalences::where('id', $request->id)->update($validatedData);
            // dd($request-> id);
            $categories = Categories::findOrFail($request->id);
            $categories->name = $validatedData['name'];
            $categories->save();
        } else {
            // Create new record
            Categories::create($validatedData);
        }
    
        return redirect()->route('categories')->with('success', 'catégorie a été ajouté.');
        
    }
}