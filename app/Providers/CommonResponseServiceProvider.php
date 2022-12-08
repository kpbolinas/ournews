<?php

namespace App\Providers;

use App\Mixins\CommonResponseMixin;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\ServiceProvider;

class CommonResponseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        ResponseFactory::mixin(new CommonResponseMixin());
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
