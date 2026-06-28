public function up()
{
    Schema::create('vulgarisations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('recherche_id')->constrained()->onDelete('cascade');
        $table->string('titre');
        $table->text('resume')->nullable();
        $table->string('pdf_path'); // chemin du PDF vulgarisation
        $table->string('niveau_public')->default('grand_public'); // grand_public, lycéen, etc.
        $table->timestamps();
    });
}
