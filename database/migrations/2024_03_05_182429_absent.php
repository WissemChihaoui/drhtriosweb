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
        Schema::create('absents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_emp');
            $table->foreign('id_emp')->references('id')->on('employees')->onDelete('cascade');
            $table->date('date');
            $table->unsignedBigInteger('type_absents');
            $table->foreign('type_absents')->references('id')->on('type_absents')->onDelete('cascade');
            $table->string('raison');
            $table->string('statut');
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
        Schema::dropIfExists('absents');
    }
};