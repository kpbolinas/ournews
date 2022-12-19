<?php

namespace App\Http\Resources\Reporter;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'photo' => $this->photo,
            'published_date' => Carbon::parse($this->publish_date)->toDateString(),
            'reporter_name' => $this->reporter->first_name . ' ' . $this->reporter->last_name,
        ];
    }
}
