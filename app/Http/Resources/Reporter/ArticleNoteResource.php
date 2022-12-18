<?php

namespace App\Http\Resources\Reporter;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleNoteResource extends JsonResource
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
            'notes' => $this->notes,
            'updated_at' => Carbon::parse($this->updated_at)->rawFormat('Y-m-d H:i'),
        ];
    }
}
