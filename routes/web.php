<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\RechercheController;
use App\Http\Controllers\Admin\VulgarisationController;

Route::prefix('admin')->name('admin.')->group(function () {

    Route::resource('recherches', RechercheController::class);

    Route::prefix('recherches/{recherche}/vulgarisations')->name('vulgarisations.')->group(function () {
    Route::get('create',                  [VulgarisationController::class, 'create'])->name('create');
    Route::post('/',                      [VulgarisationController::class, 'store'])->name('store');
    Route::get('/{vulgarisation}',        [VulgarisationController::class, 'show'])->name('show');   // ← nouveau
    Route::delete('/{vulgarisation}',     [VulgarisationController::class, 'destroy'])->name('destroy');
    });
});
