<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'article_id',
        'user_id',
        'content',
    ];

    /**
     * Relation to the commenter user table.
     */
    public function commenter()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope a query to get comments to display for an article
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param integer $articleId
     * @return mixed
     */
    public function scopeGetList($query, $articleId)
    {
        return $query
            ->where('article_id', '=', $articleId)
            ->latest();
    }
}
