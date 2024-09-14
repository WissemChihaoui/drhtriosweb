<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            SocietesTableSeeder::class,
            DepartementsTableSeeder::class,
            FonctionsTableSeeder::class,
            ContartsTableSeeder::class,
            PolyvalencesTableSeeder::class,
            TypeSalairsTableSeeder::class,
            UsersTableSeeder::class,
            CategoriesTableSeeder::class,
            SanctionsTableSeeder::class,
            // Add other seeders here if you have any
        ]);
    }
}
