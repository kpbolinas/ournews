<?php

namespace App\Http\Controllers\API\Reporter;

use App\Http\Controllers\Controller;
use App\Http\Requests\ArticleRequest;
use App\Http\Resources\Reporter\ArticleResource;
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
        $response = ArticleResource::collection($articles);

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
            $data['reporter_user_id'] = $request->user()->id;
            Article::create($data);

            return response()->respondSuccess([], 'Article saved successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }
}
