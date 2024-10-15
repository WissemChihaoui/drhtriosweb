<?php 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_societe')->nullable(); // Can be nullable if not required
            $table->foreign('id_societe')->references('id')->on('societes')->onDelete('cascade');

            $table->unsignedBigInteger('id_departement')->nullable(); // Can be nullable if not required
            $table->foreign('id_departement')->references('id')->on('departements')->onDelete('cascade');

            $table->unsignedBigInteger('id_fonction')->nullable(); // Can be nullable if not required
            $table->foreign('id_fonction')->references('id')->on('fonctions')->onDelete('cascade');

            $table->string('name')->nullable();
            $table->string('employeeID')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('gender')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('email')->nullable();
            $table->unsignedBigInteger('category_id')->nullable(); // Changed to foreign key

            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null'); // Foreign key constraint

            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('commentaire')->nullable();
            // Contract details moved to employee_contracts table

            $table->string('polyvalence')->nullable(); // Could be JSON or string
            $table->string('resume')->nullable();
            $table->string('document')->nullable();
            $table->string('cin')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
