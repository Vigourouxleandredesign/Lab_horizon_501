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
        Schema::table('recherches', function (Blueprint $table) {
            $table->dropColumn(['auteur', 'structure', 'domaine']);
        });
    }

    public function down(): void
    {
        Schema::table('recherches', function (Blueprint $table) {
            $table->string('auteur')->nullable();
            $table->text('structure')->nullable();
            $table->string('domaine')->nullable();
        });
    }
};
