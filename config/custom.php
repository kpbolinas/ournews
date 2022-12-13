<?php

return [

    /*
    |--------------------------------------------------------------------------
    | API Key
    |--------------------------------------------------------------------------
    |
    | This key is used for extra security. API requests should have this in the
    | header. Format: X-Api-Token : XXXXXXXXXX
    |
    */

    'api_token' => env('API_TOKEN', null),

    /*
    |--------------------------------------------------------------------------
    | Default Password
    |--------------------------------------------------------------------------
    |
    | Default password for the accounts.
    |
    */

    'default_password' => env('DEFAULT_PASSWORD', null),

    /*
    |--------------------------------------------------------------------------
    | Default Article Pagination
    |--------------------------------------------------------------------------
    |
    | Default number of articles per page.
    |
    */

    'article_pagination' => env('ARTICLE_PAGINATION', 3),

    /*
    |--------------------------------------------------------------------------
    | Default Comment Pagination
    |--------------------------------------------------------------------------
    |
    | Default number of comments per page.
    |
    */

    'comment_pagination' => env('COMMENT_PAGINATION', 3),
];
