<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Une vulgarisation générée par l'IA (ou saisie à la main) n'a pas forcément
     * de PDF : la colonne NOT NULL faisait échouer l'insert du job.
     */
    public function up(): void
    {
        Schema::table('vulgarisations', function (Blueprint $table) {
            $table->string('pdf_path')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('vulgarisations', function (Blueprint $table) {
            $table->string('pdf_path')->nullable(false)->change();
        });
    }
};
