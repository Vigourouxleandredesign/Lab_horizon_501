<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\RechercheController;
use App\Http\Controllers\Admin\VulgarisationController;

Route::prefix('admin')->name('admin.')->middleware(['auth'])->group(function () {

    Route::resource('recherches', RechercheController::class);

    // Vulgarisations imbriquées dans une recherche
    Route::prefix('recherches/{recherche}/vulgarisations')->name('vulgarisations.')->group(function () {
        Route::get('create',        [VulgarisationController::class, 'create'])->name('create');
        Route::post('/',            [VulgarisationController::class, 'store'])->name('store');
        Route::delete('/{vulgarisation}', [VulgarisationController::class, 'destroy'])->name('destroy');
    });
});
