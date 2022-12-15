<?php

use App\Http\Controllers\API\User\ArticleController;
use App\Http\Controllers\API\User\BookmarkController;
use App\Http\Controllers\API\User\CommentController;
use App\Http\Controllers\API\User\CommentRemoveMailController;
use App\Http\Controllers\API\User\FavoriteController;
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
            Route::post('/', [CommentController::class, 'create']);
            Route::patch('/{comment}', [CommentController::class, 'update']);
            Route::delete('/{comment}', [CommentController::class, 'delete']);
        });

        Route::prefix('/bookmarks')->group(function () {
            Route::get('/{page?}/{order?}', [BookmarkController::class, 'index']);
            Route::post('/', [BookmarkController::class, 'create']);
            Route::delete('/{bookmark}', [BookmarkController::class, 'delete']);
        });

        Route::prefix('/favorites')->group(function () {
            Route::get('/{page?}/{order?}', [FavoriteController::class, 'index']);
            Route::post('/', [FavoriteController::class, 'create']);
            Route::delete('/{favorite}', [FavoriteController::class, 'delete']);
        });

        Route::prefix('/mails')->group(function () {
            Route::get('/{page?}', [CommentRemoveMailController::class, 'index']);
            Route::delete('/{mail}', [CommentRemoveMailController::class, 'delete']);
            Route::get('/detail/{mail}', [CommentRemoveMailController::class, 'detail']);
        });
    });
});
