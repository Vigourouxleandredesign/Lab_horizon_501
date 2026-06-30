<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\RechercheController;
use App\Http\Controllers\Admin\VulgarisationController;

use App\Http\Controllers\Admin\HalImportController;

Route::prefix('admin')->name('admin.')->group(function () {

    Route::resource('recherches', RechercheController::class)
         ->parameters(['recherches' => 'recherche']);

    // Import HAL
    Route::get('hal/import',         [HalImportController::class, 'index'])->name('hal.import');
    Route::post('hal/preview',       [HalImportController::class, 'preview'])->name('hal.preview');
    Route::post('hal/import',        [HalImportController::class, 'import'])->name('hal.import.store');
    Route::post('hal/import-one', [HalImportController::class, 'importOne'])->name('hal.import.one');
    Route::get('hal/preview', fn() => redirect()->route('admin.hal.import'))->name('hal.preview.get');

    Route::prefix('recherches/{recherche}/vulgarisations')->name('vulgarisations.')->group(function () {
        Route::get('create',              [VulgarisationController::class, 'create'])->name('create');
        Route::post('/',                  [VulgarisationController::class, 'store'])->name('store');
        Route::get('/{vulgarisation}',    [VulgarisationController::class, 'show'])->name('show');
        Route::delete('/{vulgarisation}', [VulgarisationController::class, 'destroy'])->name('destroy');
    });
});

