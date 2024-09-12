<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeSalairsTableSeeder extends Seeder
{
    /**
     * Seed the type_salairs table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('type_salairs')->insert([
            ['type' => 'Mensuelle', 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'Par Heure', 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'Journalier', 'created_at' => now(), 'updated_at' => now()],
            ['type' => 'Hebdomadaire', 'created_at' => now(), 'updated_at' => now()],
            // Add more types as needed
        ]);
    }
}
