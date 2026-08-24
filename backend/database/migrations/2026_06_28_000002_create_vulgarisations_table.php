<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vulgarisations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recherche_id')->constrained()->onDelete('cascade');
            $table->string('titre');
            $table->text('resume')->nullable();
            $table->string('pdf_path');
            $table->string('niveau_public')->default('grand_public');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vulgarisations');
    }
};
