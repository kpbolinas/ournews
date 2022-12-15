<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\FavoriteRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Favorites list api
     *
     * @param \Illuminate\Http\Request $request
     * @param integer $page
     * @param integer $order
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, int $page = 1, int $order = 1)
    {
        $user = $request->user();
        $favorites = Favorite::getList([
            'user' => $user,
            'page' => $page,
            'order' => $order,
        ])->map(function ($favorite) {
            return $favorite->article;
        });
        $response = ArticleResource::collection($favorites);

        return response()->respondSuccess($response, 'Okay.');
    }

    /**
     * Bookmark create api
     *
     * @param \App\Http\Requests\FavoriteRequest $request
     * @return \Illuminate\Http\Response
     */
    public function create(FavoriteRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = $request->user()->id;
            $favorite = Favorite::create($data);

            return response()->respondSuccess(['id' => $favorite->id], 'Favorite saved successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Bookmark delete api
     *
     * @param \App\Models\Favorite $favorite
     * @return \Illuminate\Http\Response
     */
    public function delete(Favorite $favorite)
    {
        try {
            $this->authorize('delete', $favorite);
            $favorite->delete();

            return response()->respondSuccess([], 'Favorite deleted successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }
}
