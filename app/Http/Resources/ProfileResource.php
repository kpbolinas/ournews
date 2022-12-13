<?php

namespace App\Http\Resources;

use App\Enums\UserRole;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
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
            'id' => $this->id,
            'email' => $this->email,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'mails' => [],
        ];

        // Check removed comment mails and compile
        if ($this->isUserAndHaveMails()) {
            foreach ($this->mails as $mail) {
                $data['mails'][] = [
                    'id' => $mail->id,
                    'subject' => $mail->subject,
                ];
            }
        } else {
            unset($data['mails']);
        }

        return $data;
    }

    /**
     * Check if role is user and have mails
     *
     * @return bool
     */
    public function isUserAndHaveMails(): bool
    {
        return $this->mails->count() && $this->role === UserRole::User->value;
    }
}
