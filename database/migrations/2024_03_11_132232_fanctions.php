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
        Schema::create('fanctions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_societe');
            $table->foreign('id_societe')->references('id')->on('societes')->onDelete('cascade');
            $table->unsignedBigInteger('id_departement');
            $table->foreign('id_departement')->references('id')->on('departements')->onDelete('cascade');
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
        Schema::dropIfExists('fanctions');

    }
};
