<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\ArticleResource;
use App\Models\Article;

class ArticleController extends Controller
{
    /**
     * Article list api
     *
     * @param integer $page
     * @param integer $order
     * @param string $date
     * @return \Illuminate\Http\Response
     */
    public function index(int $page = 1, int $order = 1, string $date = null)
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
        $response = ArticleResource::collection($articles);

        return response()->respondSuccess($response, 'Okay.');
    }
}
