<?php

namespace App\Http\Controllers\API\Reporter;

use App\Enums\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ArticleRequest;
use App\Http\Resources\Reporter\ArticleNoteResource;
use App\Http\Resources\Reporter\ArticlePublishedResource;
use App\Http\Resources\Reporter\ArticleUnpublishedResource;
use App\Models\Article;

class ArticleController extends Controller
{
    /**
     * Article unpublished api
     *
     * @param integer $page
     * @param integer $order
     * @param string $date
     * @return \Illuminate\Http\Response
     */
    public function unpublished(int $page = 1, int $order = 1, string $date = null)
    {
        $articles = Article::reporterUnpublished()
            ->getList([
                'order' => $order,
                'date' => $date,
            ])
            ->paginate(
                config('custom.article_pagination'),
                ['articles.*'],
                'page',
                $page
            );
        $response = ArticleUnpublishedResource::collection($articles);

        return response()->respondSuccess($response, 'Okay.');
    }

    /**
     * Article create api
     *
     * @param \App\Http\Requests\ArticleRequest $request
     * @return \Illuminate\Http\Response
     */
    public function create(ArticleRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = $request->user()->id;
            Article::create($data);

            return response()->respondSuccess([], 'Article saved successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Article update api
     *
     * @param \App\Http\Requests\ArticleRequest $request
     * @param \App\Models\Article $article
     * @return \Illuminate\Http\Response
     */
    public function update(ArticleRequest $request, Article $article)
    {
        try {
            $this->authorize('update', $article);
            $data = $request->validated();
            $article->title = $data['title'];
            $article->content = $data['content'];
            $article->photo = $data['photo'] ?: null;
            $article->status = $data['status'];
            if ((int) $data['status'] === ArticleStatus::ForApproval->value) {
                $article->notes = null;
            }
            $article->save();

            return response()->respondSuccess([], 'Article updated successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Article delete api
     *
     * @param \App\Models\Article $article
     * @return \Illuminate\Http\Response
     */
    public function delete(Article $article)
    {
        try {
            $this->authorize('delete', $article);
            if (!in_array(
                $article->status,
                [
                    ArticleStatus::Draft->value,
                    ArticleStatus::ForRevision->value
                ]
            )) {
                return response()
                    ->respondBadRequest([], 'Article should be under Draft or For Revision status.');
            }
            $article->delete();

            return response()->respondSuccess([], 'Article deleted successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Article display notes api
     *
     * @param \App\Models\Article $article
     * @return \Illuminate\Http\Response
     */
    public function notes(Article $article)
    {
        $this->authorize('view', $article);
        if ($article->status !== ArticleStatus::ForRevision->value) {
            return response()
                ->respondBadRequest([], 'Article should be under For Revision status.');
        }
        $response = new ArticleNoteResource($article);

        return response()->respondSuccess($response, 'Okay.');
    }

    /**
     * Article published api
     *
     * @param integer $page
     * @param integer $order
     * @param string $date
     * @return \Illuminate\Http\Response
     */
    public function published(int $page = 1, int $order = 1, string $date = null)
    {
        $articles = Article::published()
            ->getList([
                'order' => $order,
                'date' => $date,
            ])
            ->paginate(
                config('custom.article_pagination'),
                ['articles.*'],
                'page',
                $page
            );
        $response = ArticlePublishedResource::collection($articles);

        return response()->respondSuccess($response, 'Okay.');
    }
}
