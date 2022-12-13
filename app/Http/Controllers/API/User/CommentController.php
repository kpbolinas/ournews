<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommentResource;
use App\Models\Comment;

class CommentController extends Controller
{
    /**
     * Comments list api
     *
     * @param integer $articleId
     * @param integer $page
     * @return \Illuminate\Http\Response
     */
    public function index(int $articleId, int $page = 1)
    {
        $comments = Comment::display([
            'article_id' => $articleId,
            'page' => $page,
        ]);
        $response = CommentResource::collection($comments);

        return response()->respondSuccess($response, 'Okay.');
    }
}
