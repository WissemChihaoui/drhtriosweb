<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PolyvalencesTableSeeder extends Seeder
{
    /**
     * Seed the polyvalences table.
     *
     * @return void
     */
    public function run()
    {
        // Use the valid ID of a societes record. Assume it's 1.
        $societeId = 1;

        DB::table('polyvalences')->insert([
            ['id_societe' => $societeId, 'name' => 'Polyvalence 1', 'created_at' => now(), 'updated_at' => now()],
            ['id_societe' => $societeId, 'name' => 'Polyvalence 2', 'created_at' => now(), 'updated_at' => now()],
            ['id_societe' => $societeId, 'name' => 'Polyvalence 3', 'created_at' => now(), 'updated_at' => now()],
            ['id_societe' => $societeId, 'name' => 'Polyvalence 4', 'created_at' => now(), 'updated_at' => now()],
            ['id_societe' => $societeId, 'name' => 'Polyvalence 5', 'created_at' => now(), 'updated_at' => now()],
            // Add more as needed
        ]);
    }
}
