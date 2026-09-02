<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RechercheApiController;
use App\Http\Controllers\Api\AuthApiController;

// Auth JSON
Route::middleware('web')->group(function () {
    Route::post('/register', [AuthApiController::class, 'register']);
    Route::post('/login',    [AuthApiController::class, 'login']);
    Route::post('/logout',   [AuthApiController::class, 'logout'])->middleware('auth');
    Route::get('/me',        [AuthApiController::class, 'me'])->middleware('auth');
});

// Publiques
Route::get('/recherches',            [RechercheApiController::class, 'index']);
Route::get('/recherches/{recherche}', [RechercheApiController::class, 'show']);
Route::get('/recherches/{recherche}/vulgarisations', [RechercheApiController::class, 'vulgarisations']);

// Protégées
Route::middleware('auth')->group(function () {
    Route::post('/recherches',               [RechercheApiController::class, 'store']);
    Route::put('/recherches/{recherche}',    [RechercheApiController::class, 'update']);
    Route::delete('/recherches/{recherche}', [RechercheApiController::class, 'destroy']);
});
