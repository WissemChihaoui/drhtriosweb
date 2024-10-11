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
        Schema::create('type_absents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_societe');
            $table->foreign('id_societe')->references('id')->on('societes')->onDelete('cascade');
            $table->string('type'); 
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
        Schema::table('type_absents', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
