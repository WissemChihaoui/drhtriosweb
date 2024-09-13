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
        Schema::create('emp_polys', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_emp');
            $table->foreign('id_emp')->references('id')->on('employees')->onDelete('cascade');
            $table->unsignedBigInteger('id_polyvalence');
            $table->foreign('id_polyvalence')->references('id')->on('polyvalences')->onDelete('cascade');
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
        Schema::dropIfExists('emp_polys');
    }
};
