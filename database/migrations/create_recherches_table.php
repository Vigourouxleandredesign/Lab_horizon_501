
public function up()
{
    Schema::create('recherches', function (Blueprint $table) {
        $table->id();
        $table->string('titre');
        $table->text('description')->nullable();
        $table->string('auteur')->nullable();
        $table->string('pdf_path'); // chemin du PDF recherche
        $table->string('domaine')->nullable(); // ex: médecine, informatique...
        $table->timestamps();
    });
}
