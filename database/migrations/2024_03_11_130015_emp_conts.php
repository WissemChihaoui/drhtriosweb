<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::disableForeignKeyConstraints();
        Schema::create('employee_contracts', function (Blueprint $table) {
            $table->id();
            
            // Corrected table reference from 'emplyoees' to 'employees'
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->unsignedBigInteger('contract_id')->nullable();
            $table->foreign('contract_id')->references('id')->on('contarts')->onDelete('cascade');
            $table->unsignedBigInteger('salary_type_id')->nullable();
            $table->foreign('salary_type_id')->references('id')->on('type_salairs')->onDelete('cascade');
            $table->date('contract_start_date')->nullable();
            $table->date('contract_end_date')->nullable();
            $table->String('amount')->nullable(); // Adjusted precision
            $table->timestamps();
        });
        Schema::enableForeignKeyConstraints();
    }

    public function down()
    {
        Schema::dropIfExists('employee_contracts');
    }
};
