<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;

class AdminAccess
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

        if (
            !in_array(
                $request->user()->role,
                [
                    UserRole::Admin->value,
                    UserRole::SuperAdmin->value
                ]
            )
        ) {
            abort(403, 'Access Denied (Forbidden)');
        }

        return $next($request);
    }
}
