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
        Schema::create('polyvalences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_societe')->default(1);
            $table->foreign('id_societe')->references('id')->on('societes')->onDelete('cascade');
            $table->string('name');
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
        Schema::dropIfExists('polyvalences');
    }
};