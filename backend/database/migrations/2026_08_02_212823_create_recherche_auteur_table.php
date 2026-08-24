<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recherche_auteur', function (Blueprint $table) {
            $table->foreignId('recherche_id')->constrained()->onDelete('cascade');
            $table->foreignId('auteur_id')->constrained()->onDelete('cascade');
            $table->primary(['recherche_id', 'auteur_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recherche_auteur');
    }
};
