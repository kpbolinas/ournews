<?php

namespace App\Policies;

use App\Models\CommentRemoveMail;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CommentRemoveMailPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\CommentRemoveMail  $mail
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, CommentRemoveMail $mail)
    {
        return $user->id === $mail->commenter_user_id;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\CommentRemoveMail  $mail
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, CommentRemoveMail $mail)
    {
        return $user->id === $mail->commenter_user_id;
    }
}
