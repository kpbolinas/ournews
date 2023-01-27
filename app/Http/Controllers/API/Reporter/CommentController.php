<?php

namespace App\Http\Controllers\API\Reporter;

use App\Enums\ArticleStatus;
use App\Enums\MailStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRemoveMailRequest;
use App\Http\Resources\Reporter\ArticleDetailResource;
use App\Http\Resources\Reporter\CommentResource;
use App\Models\Article;
use App\Models\Comment;
use App\Models\CommentRemoveMail;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    /**
     * Comments list api
     *
     * @param \App\Models\Article $article
     * @param integer $page
     * @return \Illuminate\Http\Response
     */
    public function index(Article $article, int $page = 1)
    {
        if ($article->status !== ArticleStatus::Published->value) {
            return response()
                ->respondBadRequest([], 'Article should be under Published status.');
        }
        $comments = Comment::getList($article->id)
            ->paginate(
                config('custom.comment_pagination'),
                ['comments.*'],
                'page',
                $page
            );
        $response = [
            'article' => new ArticleDetailResource($article),
            'comments' => CommentResource::collection($comments),
            'last_page' => $comments->lastPage(),
        ];

        return response()->respondSuccess($response, 'Okay.');
    }

    /**
     * Comment delete with mail api
     *
     * @param \App\Http\Requests\CommentRemoveMailRequest $request
     * @param \App\Models\Comment $comment
     * @return \Illuminate\Http\Response
     */
    public function delete(CommentRemoveMailRequest $request, Comment $comment)
    {
        $requestData = $request->validated();
        DB::beginTransaction();

        try {
            if ($comment->delete()) {
                $data = [
                    'comment_id' => $comment->id,
                    'commenter_user_id' => $comment->user_id,
                    'remover_user_id' => $request->user()->id,
                    'subject' => 'Notification for the removed comment on ' . $comment->article->title,
                    'content' => $requestData['content'],
                    'is_read' => MailStatus::Unread->value,
                ];
                $mail = CommentRemoveMail::create($data);
                if ($mail) {
                    DB::commit();

                    return response()->respondSuccess([], 'Comment deleted successfully.');
                }
            }
            DB::rollBack();

            return response()->respondBadRequest([], 'Something went wrong.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->respondInternalServerError([], $th->getMessage());
        }
    }
}
