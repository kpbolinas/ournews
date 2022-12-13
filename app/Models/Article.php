<?php

namespace App\Models;

use App\Enums\ArticleOrder;
use App\Enums\ArticleStatus;
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
     * Scope a query to get plublished articles
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $data
     * @return mixed
     */
    public function scopePublished($query, $data)
    {
        $query = $query->where('status', '=', ArticleStatus::Published->value);

        if ($data['date']) {
            $publishDate = Carbon::parse($data['date']);
            $start = $publishDate->toDateString() . ' 00:00:00';
            $end = $publishDate->toDateString() . ' 23:59:59';
            $query = $query->whereBetween('publish_date', [$start, $end]);
        }

        if ($data['order']) {
            switch ($data['order']) {
                case ArticleOrder::Latest->value:
                    $query = $query->latest();
                    break;

                case ArticleOrder::Oldest->value:
                    $query = $query->oldest();
                    break;

                default:
                    $query = $query->latest();
                    break;
            }
        }

        $query = $query->paginate(config('custom.article_pagination'), ['*'], 'page', $data['page']);

        return $query;
    }
}
