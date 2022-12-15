<?php

namespace App\Providers;

use App\Models\Bookmark;
use App\Models\Comment;
use App\Models\Favorite;
use App\Models\CommentRemoveMail;
use App\Policies\BookmarkPolicy;
use App\Policies\CommentPolicy;
use App\Policies\FavoritePolicy;
use App\Policies\CommentRemoveMailPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Bookmark::class => BookmarkPolicy::class,
        Comment::class => CommentPolicy::class,
        Favorite::class => FavoritePolicy::class,
        CommentRemoveMail::class => CommentRemoveMailPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
    }
}
