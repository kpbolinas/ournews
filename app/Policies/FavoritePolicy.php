<?php

namespace App\Policies;

use App\Models\Favorite;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FavoritePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Favorite  $favorite
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Favorite $favorite)
    {
        return $user->id === $favorite->user_id;
    }
}
