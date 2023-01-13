<?php

namespace App\Http\Controllers\API;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\EditInfoRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\VerificationRequest;
use App\Http\Resources\ProfileResource;
use App\Mail\ForgotPasswordVerification;
use App\Mail\RegistrationVerification;
use App\Mail\TemporaryPassword;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;
use Throwable;

class UserController extends Controller
{
    /**
     * User register api
     *
     * @param \App\Http\Requests\RegisterRequest $request
     * @return \Illuminate\Http\Response
     */
    public function register(RegisterRequest $request)
    {
        DB::beginTransaction();

        try {
            $data = $request->validated();
            $vtoken = 'UR' . Str::random(10);
            $data['password'] = Hash::make($data['password']);
            $data += [
                'role' => UserRole::User,
                'activated' => UserStatus::Inactive,
                'verification_token' => $vtoken,
            ];
            $user = User::create($data);

            if ($user) {
                $to = (object) [
                    'email' => $data['email'],
                    'name' => $data['first_name'] . ' ' . $data['last_name'],
                ];
                $mailData = [
                    'email' => $data['email'],
                    'verification_token' => $vtoken,
                ];
                $mail = Mail::to($to)->send(new RegistrationVerification($mailData));

                if ($mail) {
                    DB::commit();

                    return response()->respondSuccess([], 'User registration successful.');
                }
                DB::rollBack();

                return response()->respondBadRequest([], 'User registration failed. Unable to send email.');
            }
            DB::rollBack();

            return response()->respondBadRequest([], 'User registration failed.');
        } catch (Throwable $th) {
            DB::rollBack();

            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Login api
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        try {
            if (Auth::attempt([
                'email' => $request->email,
                'password' => $request->password,
                'activated' => UserStatus::Active,
            ])) {
                $user = $request->user();
                PersonalAccessToken::where('tokenable_id', $user->id)->delete();
                $data = [
                    'token' => $user->createToken('OURNews')->plainTextToken,
                    'role' => $user->role,
                ];

                return response()->respondSuccess($data, 'Login successful.');
            }

            return response()->respondBadRequest([], 'Invalid email or password. Please try again.');
        } catch (Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Logout api
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        try {
            $accessToken = $request->bearerToken();

            if ($accessToken) {
                $token = PersonalAccessToken::findToken($accessToken);

                if ($token && $token->delete()) {
                    return response()->respondSuccess([], 'Logout successful.');
                }
            }

            return response()->respondBadRequest([], 'Something went wrong.');
        } catch (Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * User verification api
     *
     * @param \App\Http\Requests\VerificationRequest $request
     * @return \Illuminate\Http\Response
     */
    public function verification(VerificationRequest $request)
    {
        DB::beginTransaction();

        try {
            $user = User::where(
                [
                    'email' => $request->email,
                    'verification_token' => $request->token,
                ]
            )
                ->first();

            if ($user) {
                $user->verification_token = null;
                $type = substr($request->token, 0, 2);
                $message = '';

                switch ($type) {
                    case 'UR': // User Registration
                        $user->activated = UserStatus::Active;
                        $user->save();

                        return response()->respondSuccess([], 'Verification successful.');
                    case 'FP': // Forgot Password
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

                                return response()->respondSuccess([], 'Password reset successful.');
                            }
                            DB::rollBack();

                            return response()->respondBadRequest([], 'Unable to send email.');
                        }
                        DB::rollBack();

                        return response()->respondBadRequest([], 'Unable to save temporary password.');
                }
            }
            DB::rollBack();

            return response()->respondBadRequest([], 'Invalid email or verification token. Please try again.');
        } catch (Throwable $th) {
            DB::rollBack();

            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * User forgot password api
     *
     * @param \App\Http\Requests\ForgotPasswordRequest $request
     * @return \Illuminate\Http\Response
     */
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        DB::beginTransaction();

        try {
            $user = User::where(['email' => $request->email])->first();

            if ($user) {
                $vtoken = 'FP' . Str::random(10);
                $user->verification_token = $vtoken;

                if ($user->save()) {
                    $to = (object) [
                        'email' => $user->email,
                        'name' => $user->first_name . ' ' . $user->last_name,
                    ];
                    $mailData = [
                        'email' => $user->email,
                        'verification_token' => $vtoken,
                    ];
                    $mail = Mail::to($to)->send(new ForgotPasswordVerification($mailData));

                    if ($mail) {
                        DB::commit();

                        return response()->respondSuccess([], 'Email sent.');
                    }
                }
                DB::rollBack();

                return response()->respondBadRequest([], 'Something went wrong. Unable to send email.');
            }
            DB::rollBack();

            return response()->respondBadRequest([], 'Something went wrong. Unable to send email.');
        } catch (Throwable $th) {
            DB::rollBack();

            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * User profile api
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function profile(Request $request)
    {
        $userProfile = new ProfileResource($request->user());

        return response()->respondSuccess($userProfile, 'Okay.');
    }

    /**
     * User change password api
     *
     * @param \App\Http\Requests\ChangePasswordRequest $request
     * @return \Illuminate\Http\Response
     */
    public function changePassword(ChangePasswordRequest $request)
    {
        try {
            $data = $request->validated();
            $user = $request->user();
            $user->password = Hash::make($data['new_password']);
            $user->save();

            return response()->respondSuccess([], 'Change password successful.');
        } catch (Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * User edit info api
     *
     * @param \App\Http\Requests\EditInfoRequest $request
     * @return \Illuminate\Http\Response
     */
    public function editInfo(EditInfoRequest $request)
    {
        try {
            $data = $request->validated();
            $user = $request->user();
            $user->first_name = $data['first_name'];
            $user->last_name = $data['last_name'];
            $user->save();

            return response()->respondSuccess([], 'Update info successful.');
        } catch (Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * Validate auth token api
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function validateAuthToken(Request $request)
    {
        try {
            $accessToken = $request->bearerToken();

            if (!$accessToken) {
                return response()->respondUnauthorized('Unauthorized Access');
            }

            $token = PersonalAccessToken::findToken($accessToken);

            if (!$token) {
                return response()->respondUnauthorized('Unauthorized Access');
            }

            return response()->respondSuccess([], 'Authorization token is valid.');
        } catch (Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }
}
