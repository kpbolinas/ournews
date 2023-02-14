<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CommentRemoveMail extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'comment_id',
        'commenter_user_id',
        'remover_user_id',
        'subject',
        'content',
        'is_read',
    ];

    /**
     * Scope a query to get comments to display for an article
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param \App\Models\User $user
     * @return mixed
     */
    public function scopeGetList($query, User $user)
    {
        return $query
            ->where('comment_remove_mails.commenter_user_id', '=', $user->id)
            ->latest('comment_remove_mails.created_at');
    }
}
