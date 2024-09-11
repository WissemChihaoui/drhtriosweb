<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,png,pdf|max:2048', // Adjust validation rules as needed
        ]);

        if ($request->file()) {
            $file = $request->file('file');
            $filePath = $file->store('uploads', 'public'); // Save the file in the 'public/uploads' directory

            return response()->json([
                'success' => true,
                'file_path' => $filePath,
                'url' => Storage::url($filePath) // Generate the URL to access the file
            ]);
        }

        return response()->json(['success' => false], 400);
    }
}
