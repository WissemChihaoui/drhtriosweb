<?php
namespace App\Http\Controllers;
use Inertia\Inertia;

class DocumentationController extends Controller{
    public function index(){
        return Inertia::render('Documentation/Documentation');
    }
}