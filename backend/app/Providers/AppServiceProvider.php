<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Recherche;
use App\Policies\RecherchePolicy;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Recherche::class, RecherchePolicy::class);
    }
}
