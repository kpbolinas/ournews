<?php

use App\Http\Controllers\API\User\ArticleController;
use App\Http\Controllers\API\User\CommentController;
use App\Http\Controllers\API\User\UserController as ReaderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::prefix('/users')->group(function () {
    Route::post('/register', [ReaderController::class, 'register']);
    Route::post('/login', [ReaderController::class, 'login']);
    Route::post('/logout', [ReaderController::class, 'logout']);
    Route::post('/verification', [ReaderController::class, 'verification']);
    Route::post('/forgot-password', [ReaderController::class, 'forgotPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [ReaderController::class, 'profile']);
        Route::patch('/change-password', [ReaderController::class, 'changePassword']);
        Route::patch('/edit-info', [ReaderController::class, 'editInfo']);
        Route::get('/articles/{page?}/{order?}/{date?}', [ArticleController::class, 'index']);

        Route::prefix('/comments')->group(function () {
            Route::get('/{articleId}/{page?}', [CommentController::class, 'index']);
        });
    });
});
