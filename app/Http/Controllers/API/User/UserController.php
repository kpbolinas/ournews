<?php

namespace App\Http\Controllers\API\User;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\User\UserProfileResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;
use PhpParser\Node\Stmt\TryCatch;
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
            $requestData = $request->all();
            $vtoken = 'UR' . Str::random(10);
            $data = [
                'email' => $requestData['email'],
                'first_name' => $requestData['first_name'],
                'last_name' => $requestData['last_name'],
                'password' => Hash::make($requestData['password']),
                'role' => UserRole::User,
                'activated' => UserStatus::Inactive,
                'verification_token' => $vtoken,
            ];
            $user = User::create($data);

            if ($user) {
                //TO DO - send mail
                $mail = true;

                if ($mail) {
                    $responseData = [
                        'first_name' => $requestData['first_name'],
                        'verification_token' => $vtoken,
                    ];
                    DB::commit();

                    return response()->respondSuccess($responseData, 'User registered successfully.');
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
     * User login api
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
                $data = ['token' => $user->createToken('OURNews')->plainTextToken];

                return response()->respondSuccess($data, 'User login successfully.');
            }

            return response()->respondBadRequest([], 'Invalid email or password. Please try again.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * User logout api
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
                    return response()->respondSuccess([], 'User logout successfully.');
                }
            }

            return response()->respondBadRequest([], 'Something went wrong.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * User verification api
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function verification(Request $request)
    {
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
                        $message = 'User verified successfully.';
                        break;

                    case 'FP': // Forgot Password
                        $user->password = Hash::make(config('custom.default_password'));
                        $message = 'User password reset successful.';
                        break;

                    default:
                        # code...
                        break;
                }
                $user->save();

                return response()->respondSuccess([], $message);
            }

            return response()->respondBadRequest([], 'Invalid email or verification token. Please try again.');
        } catch (\Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * User forgot password api
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function forgotPassword(Request $request)
    {
        DB::beginTransaction();

        try {
            $user = User::where(['email' => $request->email])->first();

            if ($user) {
                $vtoken = 'FP' . Str::random(10);
                $user->verification_token = $vtoken;

                if ($user->save()) {
                    // TO DO - Send mail
                    $mail = true;

                    if ($mail) {
                        DB::commit();

                        return response()->respondSuccess(['token' => $vtoken], 'Email sent.');
                    }
                }
                DB::rollBack();

                return response()->respondBadRequest([], 'Something went wrong. Unable to send email.');
            }
            DB::rollBack();

            return response()->respondBadRequest([], 'Something went wrong. Unable to send email.');
        } catch (\Throwable $th) {
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
        $userProfile = new UserProfileResource($request->user());

        return response()->respondSuccess($userProfile, 'Okay.');
    }
}
