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
        Schema::create('questionnaires', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_emp');
            $table->foreign('id_emp')->references('id')->on('employees')->onDelete('cascade');
            $table->unsignedBigInteger('id_sanction');
            $table->foreign('id_sanction')->references('id')->on('sanctions')->onDelete('cascade');
            $table->string('description');
            $table->date('date');
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
        Schema::table('questionnaires', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};