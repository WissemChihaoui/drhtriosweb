<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SanctionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('sanctions')->insert([
            [
                'id_societe' => 1, // Assuming Societe with ID 1 exists
                'type_sanction' => 'Warning',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_societe' => 1,
                'type_sanction' => 'Suspension',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_societe' => 1,
                'type_sanction' => 'Termination',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
