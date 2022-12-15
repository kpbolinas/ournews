<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CommentRemoveMail extends Model
{
    use HasFactory, SoftDeletes;

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
     * @param array $data
     * @return mixed
     */
    public function scopeGetList($query, $data)
    {
        return $query
            ->where('comment_remove_mails.commenter_user_id', '=', $data['user']->id)
            ->latest('comment_remove_mails.created_at')
            ->paginate(config('custom.mail_pagination'), ['*'], 'page', $data['page']);
    }
}
