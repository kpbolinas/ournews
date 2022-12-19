<?php

use App\Http\Controllers\API\Reporter\ArticleController as ReporterArticleController;
use App\Http\Controllers\API\Reporter\CommentController as ReporterCommentController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\User\ArticleController as ReaderArticleController;
use App\Http\Controllers\API\User\BookmarkController;
use App\Http\Controllers\API\User\CommentController as ReaderCommentController;
use App\Http\Controllers\API\User\CommentRemoveMailController;
use App\Http\Controllers\API\User\FavoriteController;
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

// Common API routes
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);
Route::post('/verification', [UserController::class, 'verification']);
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);

// Common API routes requiring auth
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [UserController::class, 'profile']);
    Route::patch('/change-password', [UserController::class, 'changePassword']);
    Route::patch('/edit-info', [UserController::class, 'editInfo']);
});

// API routes for users or readers
Route::prefix('/users')->middleware('auth:sanctum')->group(function () {
    Route::get('/articles/{page?}/{order?}/{date?}', [ReaderArticleController::class, 'index']);

    Route::prefix('/comments')->group(function () {
        Route::get('/{article}/{page?}', [ReaderCommentController::class, 'index']);
        Route::post('/', [ReaderCommentController::class, 'create']);
        Route::patch('/{comment}', [ReaderCommentController::class, 'update']);
        Route::delete('/{comment}', [ReaderCommentController::class, 'delete']);
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

// API routes for reporters
Route::prefix('/reporters')->middleware(['auth:sanctum', 'reporter.access'])->group(function () {
    Route::prefix('/articles')->group(function () {
        Route::get('/unpublished/{page?}/{order?}/{date?}', [ReporterArticleController::class, 'unpublished']);
        Route::post('/', [ReporterArticleController::class, 'create']);
        Route::patch('/{article}', [ReporterArticleController::class, 'update']);
        Route::delete('/{article}', [ReporterArticleController::class, 'delete']);
        Route::get('/notes/{article}', [ReporterArticleController::class, 'notes']);
        Route::get('/published/{page?}/{order?}/{date?}', [ReporterArticleController::class, 'published']);
    });
    Route::prefix('/comments')->group(function () {
        Route::get('/{article}/{page?}', [ReporterCommentController::class, 'index']);
        Route::delete('/{comment}', [ReporterCommentController::class, 'delete']);
    });
});
