<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookmarkRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Bookmark;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    /**
     * Bookmarks list api
     *
     * @param \Illuminate\Http\Request $request
     * @param integer $page
     * @param integer $order
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, int $page = 1, int $order = 1)
    {
        $user = $request->user();
        $bookmarks = Bookmark::getList([
            'user' => $user,
            'page' => $page,
            'order' => $order,
        ])->map(function ($bookmark) {
            return $bookmark->article;
        });
        $response = ArticleResource::collection($bookmarks);

        return response()->respondSuccess($response, 'Okay.');
    }

    /**
     * Bookmark create api
     *
     * @param \App\Http\Requests\BookmarkRequest $request
     * @return \Illuminate\Http\Response
     */
    public function create(BookmarkRequest $request)
    {
        try {
            $data = $request->validated();
            $data['user_id'] = $request->user()->id;
            $bookmark = Bookmark::create($data);

            return response()->respondSuccess(['id' => $bookmark->id], 'Bookmark saved successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Bookmark delete api
     *
     * @param \App\Models\Bookmark $bookmark
     * @return \Illuminate\Http\Response
     */
    public function delete(Bookmark $bookmark)
    {
        try {
            $this->authorize('delete', $bookmark);
            $bookmark->delete();

            return response()->respondSuccess([], 'Bookmark deleted successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }
}
