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
        Schema::create('emp_conts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('id_emp');
            $table->foreign('id_emp')->references('id')->on('employees')->onDelete('cascade');
            $table->unsignedBigInteger('id_contrat');
            $table->foreign('id_contrat')->references('id')->on('contarts')->onDelete('cascade');
            $table->unsignedBigInteger('id_type_salair');
            $table->foreign('id_type_salair')->references('id')->on('type_salairs')->onDelete('cascade');
            $table->date('date_embauche');
            $table->date('date_debut_contrat');
            $table->date('date_fin_contrat');
            $table->decimal('montant',8,3);
            $table->timestamps();
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
        Schema::dropIfExists('emp_conts');

    }
};
