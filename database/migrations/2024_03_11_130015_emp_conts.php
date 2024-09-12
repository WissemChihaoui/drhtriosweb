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
        Schema::create('employee_contracts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('employee_id');
            $table->foreign('employee_id')->references('id')->on('emplyoees')->onDelete('cascade');
            $table->unsignedBigInteger('contract_id');
            $table->foreign('contract_id')->references('id')->on('contarts')->onDelete('cascade');
            $table->unsignedBigInteger('salary_type_id');
            $table->foreign('salary_type_id')->references('id')->on('type_salairs')->onDelete('cascade');
            $table->date('hire_date');
            $table->date('contract_start_date');
            $table->date('contract_end_date');
            $table->decimal('amount', 10, 2); // Adjusted precision
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
        Schema::dropIfExists('employee_contracts');
    }
};
