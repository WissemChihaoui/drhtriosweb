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
        Schema::create('type_salairs', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['Mensuelle', 'Par Heure']);
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
        Schema::table('type_salairs', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
