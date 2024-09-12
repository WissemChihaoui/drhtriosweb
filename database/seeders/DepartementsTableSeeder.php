<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartementsTableSeeder extends Seeder
{
    /**
     * Seed the departements table.
     *
     * @return void
     */
    public function run()
    {
        // Directly using ID 1 for societe
        $societeId = 1;

        DB::table('departements')->insert([
            [
                'id_societe' => $societeId,
                'nom_departement' => 'Informatique',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_societe' => $societeId,
                'nom_departement' => 'Mécanique',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_societe' => $societeId,
                'nom_departement' => 'RH',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
