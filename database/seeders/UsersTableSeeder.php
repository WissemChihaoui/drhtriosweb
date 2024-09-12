<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Seed the users table with one record.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'id_societe' => 1, // Assuming id_societe 1 exists
            'phone' => '29620754',
            'name' => 'Wissem Chihaoui',
            'adress' => '123 Main St, Anytown, USA',
            'company' => 'Example Corp',
            'email' => 'admin@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('12345678'), // Use a hashed password
            'remember_token' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
