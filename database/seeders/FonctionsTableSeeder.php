<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FonctionsTableSeeder extends Seeder
{
    /**
     * Seed the fonctions table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('fonctions')->insert([
            'id_societe' => 1,
            'id_departement' => 1, // Assign to the "undefined" department
            'name' => '-',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        // Assuming department IDs are known and already present
        $departementIds = [
            'Informatique' => 2, // Example IDs, adjust according to your actual IDs
            'Mécanique' => 3,
            'RH' => 4,
        ];

        // Example data for each department
        $fonctions = [
            'Informatique' => [
                'Développeur',
                'Administrateur Système',
                'Analyste',
            ],
            'Mécanique' => [
                'Ingénieur Mécanique',
                'Technicien',
                'Designer',
            ],
            'RH' => [
                'Responsable RH',
                'Chargé de Recrutement',
                'Gestionnaire de Paie',
            ],
        ];

        foreach ($fonctions as $departement => $jobs) {
            foreach ($jobs as $job) {
                DB::table('fonctions')->insert([
                    'id_societe' => 1, // Assuming all fonctions are under the same société
                    'id_departement' => $departementIds[$departement],
                    'name' => $job,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
