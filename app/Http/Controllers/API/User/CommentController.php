<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRequest;
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
        $comments = Comment::getList([
            'article_id' => $articleId,
            'page' => $page,
        ]);
        $response = CommentResource::collection($comments);

        return response()->respondSuccess($response, 'Okay.');
    }

    /**
     * Comment create api
     *
     * @param \App\Http\Requests\CommentRequest $request
     * @return \Illuminate\Http\Response
     */
    public function create(CommentRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = $request->user()->id;
            Comment::create($data);

            return response()->respondSuccess([], 'Comment saved successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Comment update api
     *
     * @param \App\Http\Requests\CommentRequest $request
     * @param \App\Models\Comment $comment
     * @return \Illuminate\Http\Response
     */
    public function update(CommentRequest $request, Comment $comment)
    {
        try {
            $this->authorize('update', $comment);
            $data = $request->validated();
            $comment->content = $data['content'];
            $comment->save();

            return response()->respondSuccess([], 'Comment updated successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Comment delete api
     *
     * @param \App\Models\Comment $comment
     * @return \Illuminate\Http\Response
     */
    public function delete(Comment $comment)
    {
        try {
            $this->authorize('delete', $comment);
            $comment->delete();

            return response()->respondSuccess([], 'Comment deleted successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }
}
