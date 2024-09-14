<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\WorkerController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\PolyvalencesController;
use App\Http\Controllers\SanctionsController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/workers', [WorkerController::class, 'index'])->name('workers');
    Route::delete('/workers/{id}', [WorkerController::class, 'destroy'])->name('workers.destroy');
    Route::post('/workers', [WorkerController::class, 'deleteMultiple'])->name('workers.deleteMultiple');
    Route::get('/add-worker', [WorkerController::class, 'add'])->name('worker.add.page');
    Route::post('/add-worker', [WorkerController::class, 'addWorker'])->name('add.worker');
});

Route::post('/upload-file', [FileUploadController::class, 'upload'])->name('file.upload');

Route::middleware(['auth','verified'])->group(function () {
    Route::get('/departements', [DepartementController::class, 'index'])->name('departements');
    Route::delete('/departements/{id}', [DepartementController::class, 'destroy'])->name('departements.destroy');
    Route::post('/departements', [DepartementController::class, 'deleteMultiple'])->name('departements.deleteMultiple');
    Route::post('add/departements', [DepartementController::class, 'saveDepartement'])->name('add.departement');
});


Route::middleware(['auth','verified'])->group(function () {
    Route::get('/polyvalence', [PolyvalencesController::class, 'index'])->name('polyvalence');
    Route::get('/machines', [PolyvalencesController::class, 'machines'])->name('machines');
    Route::delete('/machines/{id}', [PolyvalencesController::class, 'deleteMachine'])->name('machines.destroy');
    Route::post('/machines', [PolyvalencesController::class, 'deleteMachines'])->name('machines.destroyMultiple');
    Route::post('add/machines', [PolyvalencesController::class, 'storeOrUpdate'])->name('machines.store');
});

Route::middleware(['auth','verified'])->group(function () {
    Route::get('/sanctions', [SanctionsController::class, 'index'])->name('sanctions');
});

require __DIR__.'/auth.php';
