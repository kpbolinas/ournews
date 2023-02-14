<?php

namespace App\Models;

use App\Enums\Order;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bookmark extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'article_id',
        'user_id',
    ];

    /**
     * Relation to the article table.
     */
    public function article()
    {
        return $this->hasOne(Article::class, 'id', 'article_id');
    }

    /**
     * Scope a query to get comments to display for an article
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $data
     * @return mixed
     */
    public function scopeGetList($query, $data)
    {
        $query = $query
            ->whereHas('article', function ($query) {
                $query->published();
            })
            ->where('bookmarks.user_id', '=', $data['user']->id);

        if ($data['order']) {
            switch ($data['order']) {
                case Order::Oldest->value:
                    $query = $query->oldest('bookmarks.created_at');
                    break;

                case Order::Latest->value:
                default:
                    $query = $query->latest('bookmarks.created_at');
                    break;
            }
        }

        return $query;
    }
}
