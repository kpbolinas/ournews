<?php

namespace App\Http\Resources\User;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $bookmarked = $this->bookmarked($request->user());
        $bookmarkId = $bookmarked->count() ? $bookmarked->first()->id : null;
        $favorite = $this->favorite($request->user());
        $favoriteId = $favorite->count() ? $favorite->first()->id : null;

        return [
            'id' => $this->id,
            'bookmark_id' => $bookmarkId,
            'favorite_id' => $favoriteId,
            'title' => $this->title,
            'content' => $this->content,
            'photo' => $this->photo,
            'published_date' => Carbon::parse($this->publish_date)->toDateString(),
            'reporter_name' => $this->reporter->first_name . ' ' . $this->reporter->last_name,
            'comments_count' => $this->comments->count(),
        ];
    }
}
