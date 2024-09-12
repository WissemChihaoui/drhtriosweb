<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SocietesTableSeeder extends Seeder
{
    /**
     * Seed the societes table.
     *
     * @return void
     */
    public function run()
    {
        DB::table('societes')->insert([
            [
                'nom_societe' => 'Triosweb',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
