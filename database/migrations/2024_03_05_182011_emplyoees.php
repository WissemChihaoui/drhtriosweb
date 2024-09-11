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
            $table->unsignedBigInteger('id_societe')->nullable();
            $table->foreign('id_societe')->references('id')->on('societes')->onDelete('cascade');
            $table->unsignedBigInteger('id_departement')->nullable();
            $table->foreign('id_departement')->references('id')->on('departements')->onDelete('cascade');
            $table->unsignedBigInteger('id_fonction')->nullable();
            $table->foreign('id_fonction')->references('id')->on('fonctions')->onDelete('cascade');
            $table->string('name')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('gender')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('email')->nullable();
            $table->string('category')->nullable();
            $table->string('contract')->nullable();
            $table->date('date_embauche')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('salary')->nullable();
            $table->string('polyvalence')->nullable();
            $table->string('resume')->nullable();
            $table->string('document')->nullable();
            $table->string('cin')->nullable();
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
        Schema::dropIfExists('employees');
    }
};
