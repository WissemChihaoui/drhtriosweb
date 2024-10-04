<?php
namespace App\Http\Controllers;
use Inertia\Inertia;

class DocumentationController extends Controller{
    public function index(){
        return Inertia::render('Documentation/Documentation');
    }
    public function rapportJournalier($dateQuery){
        return Inertia::render('Documentation/Partials/documentsGen/RapportJournalier',[
            'date'=>$dateQuery,
        ]);
    }
}