<?php

namespace App\Http\Controllers\API\Admin;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\MemberRequest;
use App\Http\Resources\Admin\MemberResource;
use App\Mail\NewMemberNotification;
use App\Mail\TemporaryPassword;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;

class UserController extends Controller
{
    /**
     * Members list api
     *
     * @param integer $page
     * @param integer $role
     * @param string $keyword
     * @return \Illuminate\Http\Response
     */
    public function index(int $page = 1, int $role = null, string $keyword = null)
    {
        $articles = User::getList([
            'role' => $role,
            'keyword' => $keyword,
        ])
            ->paginate(
                config('custom.member_pagination'),
                ['users.*'],
                'page',
                $page
            );
        $response = MemberResource::collection($articles);

        return response()->respondSuccess($response, 'Okay.');
    }

    /**
     * Member create api
     *
     * @param \App\Http\Requests\MemberRequest $request
     * @return \Illuminate\Http\Response
     */
    public function create(MemberRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();
            $tempPass = Str::random(10);
            $data['password'] = Hash::make($tempPass);
            $data['activated'] = UserStatus::Active;
            $user = User::create($data);

            if ($user) {
                $to = (object) [
                    'email' => $user->email,
                    'name' => $user->first_name . ' ' . $user->last_name,
                ];
                $mailData = [
                    'email' => $user->email,
                    'temporary_password' => $tempPass,
                ];
                $mail = Mail::to($to)->send(new NewMemberNotification($mailData));

                if ($mail) {
                    DB::commit();

                    return response()->respondSuccess([], 'Member created successfully.');
                }
                DB::rollBack();

                return response()->respondBadRequest([], 'Unable to send email.');
            }
            DB::rollBack();

            return response()->respondBadRequest([], 'Failed to create memeber.');
        } catch (Throwable $th) {
            DB::rollBack();

            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Member reset password api
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function resetPassword(User $user)
    {
        DB::beginTransaction();

        try {
            if (in_array($user->role, [UserRole::SuperAdmin->value, UserRole::User])) {
                return response()
                    ->respondBadRequest([], 'Member should be a Reporter, Moderator or an Admin only.');
            }
            $tempPass = Str::random(10);
            $user->password = Hash::make($tempPass);
            if ($user->save()) {
                $to = (object) [
                    'email' => $user->email,
                    'name' => $user->first_name . ' ' . $user->last_name,
                ];
                $mailData = [
                    'email' => $user->email,
                    'temporary_password' => $tempPass,
                ];
                $mail = Mail::to($to)->send(new TemporaryPassword($mailData));

                if ($mail) {
                    DB::commit();

                    return response()->respondSuccess([], 'Member reset password successful.');
                }
                DB::rollBack();

                return response()->respondBadRequest([], 'Unable to send email.');
            }
            DB::rollBack();

            return response()->respondBadRequest([], 'Unable to save temporary password.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Member deactivate api
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function deactivate(User $user)
    {
        DB::beginTransaction();

        try {
            if (in_array($user->role, [UserRole::SuperAdmin->value, UserRole::User])) {
                return response()
                    ->respondBadRequest([], 'Member should be a Reporter, Moderator or an Admin only.');
            }
            $user->activated = UserStatus::Inactive->value;
            $user->save();
            $user->delete();
            DB::commit();

            return response()->respondSuccess([], 'Member deactivated successfully.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->respondInternalServerError([], $th->getMessage());
        }
    }
}
