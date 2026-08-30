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
        Schema::create('recherche_mot_cle', function (Blueprint $table) {
            $table->foreignId('recherche_id')->constrained()->onDelete('cascade');
            $table->foreignId('mot_cle_id')->constrained('mots_cles')->onDelete('cascade');
            $table->primary(['recherche_id', 'mot_cle_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recherche_mot_cle');
    }
};
