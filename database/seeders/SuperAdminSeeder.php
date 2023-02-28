<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now();
        DB::table('users')->insert([
            'email' => 'admin@admin.com',
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'password' => Hash::make(config('custom.default_password')),
            'role' => UserRole::SuperAdmin->value,
            'activated' => UserStatus::Active->value,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }
}
