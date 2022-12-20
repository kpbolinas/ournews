<?php

namespace App\Http\Controllers\API\Moderator;

use App\Enums\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ArticleReviseRequest;
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
        $articles = Article::moderatorUnpublished()
            ->getList([
                'order' => $order,
                'date' => $date ? ['field' => 'updated_at', 'value' => $date] : null,
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
     * Article publish api
     *
     * @param \App\Models\Article $article
     * @return \Illuminate\Http\Response
     */
    public function publish(Article $article)
    {
        try {
            if ($article->status !== ArticleStatus::ForApproval->value) {
                return response()
                    ->respondBadRequest([], 'Article should be under For Approval status.');
            }
            $article->status = ArticleStatus::Published->value;
            $article->save();

            return response()->respondSuccess([], 'Article published successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Article revise api
     *
     * @param \App\Http\Requests\ArticleReviseRequest $request
     * @param \App\Models\Article $article
     * @return \Illuminate\Http\Response
     */
    public function revise(ArticleReviseRequest $request, Article $article)
    {
        try {
            if ($article->status !== ArticleStatus::ForApproval->value) {
                return response()
                    ->respondBadRequest([], 'Article should be under For Approval status.');
            }
            $data = $request->validated();
            $article->notes = $data['notes'];
            $article->status = ArticleStatus::ForRevision->value;
            $article->save();

            return response()->respondSuccess([], 'Article updated successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Article archive api
     *
     * @param \App\Models\Article $article
     * @return \Illuminate\Http\Response
     */
    public function archive(Article $article)
    {
        try {
            if ($article->status !== ArticleStatus::ForApproval->value) {
                return response()
                    ->respondBadRequest([], 'Article should be under For Approval status.');
            }
            $article->status = ArticleStatus::Archived->value;
            $article->save();

            return response()->respondSuccess([], 'Article archived successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
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
                'date' => $date ? ['field' => 'publish_date', 'value' => $date] : null,
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

    /**
     * Article unpublish api
     *
     * @param \App\Models\Article $article
     * @return \Illuminate\Http\Response
     */
    public function unpublish(Article $article)
    {
        try {
            if ($article->status !== ArticleStatus::Published->value) {
                return response()
                    ->respondBadRequest([], 'Article should be under Published status.');
            }
            $article->status = ArticleStatus::ForApproval->value;
            $article->save();

            return response()->respondSuccess([], 'Article unpublished successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Article archived list api
     *
     * @param integer $page
     * @param integer $order
     * @param string $date
     * @return \Illuminate\Http\Response
     */
    public function archived(int $page = 1, int $order = 1, string $date = null)
    {
        $articles = Article::archived()
            ->getList([
                'order' => $order,
                'date' => $date ? ['field' => 'updated_at', 'value' => $date] : null,
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
     * Article unarchive api
     *
     * @param \App\Models\Article $article
     * @return \Illuminate\Http\Response
     */
    public function unarchive(Article $article)
    {
        try {
            if ($article->status !== ArticleStatus::Archived->value) {
                return response()
                    ->respondBadRequest([], 'Article should be under Archived status.');
            }
            $article->status = ArticleStatus::ForApproval->value;
            $article->save();

            return response()->respondSuccess([], 'Article unarchived successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }
}
