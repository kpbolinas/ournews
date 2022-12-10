<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;

class UserProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $data = [
            'email' => $this->email,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'mails' => [],
        ];

        // Check removed comment mails and compile
        if ($this->mails->count()) {
            foreach ($this->mails as $mail) {
                $data['mails'][] = [
                    'id' => $mail->id,
                    'subject' => $mail->subject,
                ];
            }
        }

        return $data;
    }
}
