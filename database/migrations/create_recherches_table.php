<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recherches', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->text('abstract')->nullable();        // ← résumé HAL
            $table->string('auteur')->nullable();
            $table->string('structure')->nullable();     // ← structName_s
            $table->string('pdf_path')->nullable();      // ← nullable car HAL n'a pas de PDF
            $table->string('domaine')->nullable();
            $table->date('date_production')->nullable(); // ← producedDate_tdate
            $table->string('source')->default('manuel'); // ← 'manuel' ou 'hal'
            $table->string('hal_id')->nullable()->unique(); // ← évite les doublons
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recherches');
    }
};
