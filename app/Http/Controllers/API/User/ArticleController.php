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
        $quantity = $page * config('custom.article_user_pagination');
        $articles = Article::published()
            ->getList([
                'order' => $order,
                'date' => $date ? ['field' => 'publish_date', 'value' => $date] : null,
            ])
            ->paginate($quantity, ['articles.*'], 'page', 1);
        $response = ArticleResource::collection($articles);

        return response()->respondSuccess(['articles' => $response, 'last_page' => $articles->lastPage()], 'Okay.');
    }
}
