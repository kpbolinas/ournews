<?php

namespace App\Http\Resources\Reporter;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
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
            'content' => $this->content,
            'first_name' => $this->commenter->first_name,
            'last_name' => $this->commenter->last_name,
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d H:i'),
        ];
    }
}
