<?php

namespace App\Models;

use App\Enums\Order;
use App\Enums\ArticleStatus;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Relation to the reporter user table.
     */
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_user_id');
    }

    /**
     * Relation to the comments table.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Relation to the bookmarks table.
     * Check if article is already bookmarked by the current user.
     *
     * @param \App\Models\User $user
     */
    public function bookmarked(User $user)
    {
        return $this->hasOne(Bookmark::class)->where('user_id', '=', $user->id);
    }

    /**
     * Relation to the favorites table.
     * Check if article is already favorite by the current user.
     *
     * @param \App\Models\User $user
     */
    public function favorite(User $user)
    {
        return $this->hasOne(Favorite::class)->where('user_id', '=', $user->id);
    }

    /**
     * Scope a query to get plublished articles
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeIsPublished($query)
    {
        return $query->where('articles.status', '=', ArticleStatus::Published->value);
    }

    /**
     * Scope a query to get articles
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $data
     * @return mixed
     */
    public function scopeGetList($query, $data)
    {
        $query = $this->isPublished();

        if ($data['date']) {
            $publishDate = Carbon::parse($data['date']);
            $start = $publishDate->toDateString() . ' 00:00:00';
            $end = $publishDate->toDateString() . ' 23:59:59';
            $query = $query->whereBetween('articles.publish_date', [$start, $end]);
        }

        if ($data['order']) {
            switch ($data['order']) {
                case Order::Latest->value:
                    $query = $query->latest('articles.created_at');
                    break;

                case Order::Oldest->value:
                    $query = $query->oldest('articles.created_at');
                    break;

                default:
                    $query = $query->latest('articles.created_at');
                    break;
            }
        }

        $query = $query->paginate(config('custom.article_pagination'), ['*'], 'page', $data['page']);

        return $query;
    }
}
