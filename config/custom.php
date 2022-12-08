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

];
