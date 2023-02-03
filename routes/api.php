<?php

use App\Http\Controllers\API\Admin\UserController as MemberController;
use App\Http\Controllers\API\Moderator\ArticleController as ModeratorArticleController;
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
Route::post('/verification', [UserController::class, 'verification']);
Route::post('/forgot-password', [UserController::class, 'forgotPassword']);

// Common API routes requiring auth
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/validate-token', [UserController::class, 'validateAuthToken']);
    Route::post('/logout', [UserController::class, 'logout']);
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
        Route::get('/{article}', [ReporterArticleController::class, 'detail']);
        Route::get('/published/{page?}/{order?}/{date?}', [ReporterArticleController::class, 'published']);
    });
    Route::prefix('/comments')->group(function () {
        Route::get('/{article}/{page?}', [ReporterCommentController::class, 'index']);
        Route::patch('/{comment}', [ReporterCommentController::class, 'delete']);
    });
});

// API routes for moderators or managers
Route::prefix('/moderators')->middleware(['auth:sanctum', 'moderator.access'])->group(function () {
    Route::prefix('/articles')->group(function () {
        Route::get('/{article}', [ModeratorArticleController::class, 'detail']);
        Route::get('/unpublished/{page?}/{order?}/{date?}', [ModeratorArticleController::class, 'unpublished']);
        Route::patch('/publish/{article}', [ModeratorArticleController::class, 'publish']);
        Route::patch('/revise/{article}', [ModeratorArticleController::class, 'revise']);
        Route::patch('/archive/{article}', [ModeratorArticleController::class, 'archive']);
        Route::get('/published/{page?}/{order?}/{date?}', [ModeratorArticleController::class, 'published']);
        Route::patch('/unpublish/{article}', [ModeratorArticleController::class, 'unpublish']);
        Route::get('/archived/{page?}/{order?}/{date?}', [ModeratorArticleController::class, 'archived']);
        Route::patch('/unarchive/{article}', [ModeratorArticleController::class, 'unarchive']);
    });
    Route::prefix('/comments')->group(function () {
        Route::get('/{article}/{page?}', [ReporterCommentController::class, 'index']);
        Route::patch('/{comment}', [ReporterCommentController::class, 'delete']);
    });
});

// API routes for admins
Route::prefix('/admins')->middleware(['auth:sanctum', 'admin.access'])->group(function () {
    Route::prefix('/members')->group(function () {
        Route::get('/{page?}/{role?}/{keyword?}', [MemberController::class, 'index']);
        Route::post('/', [MemberController::class, 'create']);
        Route::patch('/reset-password/{user}', [MemberController::class, 'resetPassword']);
        Route::delete('/deactivate/{user}', [MemberController::class, 'deactivate']);
    });
});
