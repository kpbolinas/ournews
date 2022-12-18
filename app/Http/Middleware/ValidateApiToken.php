<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ValidateApiToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (!$request->hasHeader('X-Api-Token')) {
            abort(401, 'Unauthorized Access');
        }

        $apiToken = $request->header('X-Api-Token');

        if ($apiToken !== config('custom.api_token')) {
            abort(401, 'Unauthorized Access');
        }

        return $next($request);
    }
}
