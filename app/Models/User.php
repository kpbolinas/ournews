<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'first_name',
        'last_name',
        'password',
        'role',
        'activated',
        'verification_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'verification_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Scope a query to get articles
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $data
     * @return mixed
     */
    public function scopeGetList($query, $data)
    {
        if ($data['keyword']) {
            $keyword = '%' . $data['keyword'] . '%';
            $query = $query->where(function ($query) use ($keyword) {
                $query->where('users.email', 'like', $keyword)
                    ->orWhere('users.first_name', 'like', $keyword)
                    ->orWhere('users.last_name', 'like', $keyword);
            });
        }

        switch ($data['role']) {
            case UserRole::Reporter->value:
                $query = $query->where('users.role', '=', UserRole::Reporter->value);
                break;

            case UserRole::Moderator->value:
                $query = $query->where('users.role', '=', UserRole::Moderator->value);
                break;

            case UserRole::Admin->value:
                $query = $query->where('users.role', '=', UserRole::Admin->value);
                break;

            default:
                $query = $query->whereIn(
                    'users.role',
                    [
                        UserRole::Reporter->value,
                        UserRole::Moderator->value,
                        UserRole::Admin->value,
                    ]
                );
                break;
        }
        $query = $query->latest('users.created_at');

        return $query;
    }
}
