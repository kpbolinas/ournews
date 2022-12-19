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
    | Default Article Pagination for Users or Readers
    |--------------------------------------------------------------------------
    |
    | Default number of articles per page.
    |
    */

    'article_user_pagination' => env('ARTICLE_USER_PAGINATION', 3),

    /*
    |--------------------------------------------------------------------------
    | Default Comment Pagination
    |--------------------------------------------------------------------------
    |
    | Default number of comments per page.
    |
    */

    'comment_pagination' => env('COMMENT_PAGINATION', 3),

    /*
    |--------------------------------------------------------------------------
    | Default Mail Pagination
    |--------------------------------------------------------------------------
    |
    | Default number of mails per page.
    |
    */

    'mail_pagination' => env('MAIL_PAGINATION', 10),

    /*
    |--------------------------------------------------------------------------
    | Default Article Pagination for Reporters and Moderators
    |--------------------------------------------------------------------------
    |
    | Default number of articles per page.
    |
    */

    'article_pagination' => env('ARTICLE_PAGINATION', 10),
];
