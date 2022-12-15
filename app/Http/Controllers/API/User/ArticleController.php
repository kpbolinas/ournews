<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
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
        $articles = Article::getList([
            'page' => $page,
            'order' => $order,
            'date' => $date,
        ]);
        $response = ArticleResource::collection($articles);

        return response()->respondSuccess($response, 'Okay.');
    }
}
