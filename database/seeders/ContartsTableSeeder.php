<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContartsTableSeeder extends Seeder
{
    /**
     * Seed the contarts table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('contarts')->insert([
            ['name' => 'CDI', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'SIVP', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'CDD', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'CAIP', 'created_at' => now(), 'updated_at' => now()]
        ]);
    }
}
