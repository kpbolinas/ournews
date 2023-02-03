<?php

namespace App\Http\Controllers\API\User;

use App\Enums\MailStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\User\MailDetailResource;
use App\Http\Resources\User\MailListResource;
use App\Models\CommentRemoveMail;
use Illuminate\Http\Request;

class CommentRemoveMailController extends Controller
{
    /**
     * Mails list api
     *
     * @param \Illuminate\Http\Request $request
     * @param integer $page
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, int $page = 1)
    {
        $user = $request->user();
        $mails = CommentRemoveMail::getList($user)
            ->paginate(
                config('custom.mail_pagination'),
                ['comment_remove_mails.*'],
                'page',
                $page
            );
        $response = MailListResource::collection($mails);

        return response()->respondSuccess(['mails' => $response, 'last_page' => $mails->lastPage()], 'Okay.');
    }

    /**
     * Mail delete api
     *
     * @param \App\Models\CommentRemoveMail $mail
     * @return \Illuminate\Http\Response
     */
    public function delete(CommentRemoveMail $mail)
    {
        try {
            $this->authorize('delete', $mail);
            $mail->delete();

            return response()->respondSuccess([], 'Mail deleted successfully.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Mail detail api
     *
     * @param \App\Models\CommentRemoveMail $mail
     * @return \Illuminate\Http\Response
     */
    public function detail(CommentRemoveMail $mail)
    {
        try {
            $this->authorize('view', $mail);
            $mail->is_read = MailStatus::Read->value;
            $mail->save();
            $response = new MailDetailResource($mail);

            return response()->respondSuccess($response, 'Okay.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }
}
