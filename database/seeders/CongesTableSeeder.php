<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CongesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('conges')->insert([
            [
                'id_societe' => 1, // Default company ID
                'nom_conge' => 'Annual Leave',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_societe' => 1, // Default company ID
                'nom_conge' => 'Sick Leave',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_societe' => 1, // Default company ID
                'nom_conge' => 'Maternity Leave',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_societe' => 1, // Default company ID
                'nom_conge' => 'Casual Leave',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
