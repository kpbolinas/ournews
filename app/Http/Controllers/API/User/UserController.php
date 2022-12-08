<?php

namespace App\Http\Controllers\API\User;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;
use Throwable;

class UserController extends Controller
{
    /**
     * User register api
     *
     * @return \Illuminate\Http\Response
     */
    public function register(RegisterRequest $request)
    {
        try {
            $requestData = $request->all();
            $vtoken = Str::random(10);
            $data = [
                'email' => $requestData['email'],
                'first_name' => $requestData['first_name'],
                'last_name' => $requestData['last_name'],
                'password' => Hash::make($requestData['password']),
                'role' => UserRole::User,
                'activated' => UserStatus::Inactive,
                'verification_token' => $vtoken,
            ];
            User::create($data);
            $responseData = [
                'first_name' => $data['first_name'],
                'verification_token' => $vtoken,
            ];

            return response()->respondSuccess($responseData, 'User registered successfully.');
        } catch (Throwable $th) {
            return response()->respondInternalServerError([], $th->getMessage());
        }
    }

    /**
     * User login api
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        if (Auth::attempt([
            'email' => $request->email,
            'password' => $request->password,
            'activated' => UserStatus::Active,
        ])) {
            $user = $request->user();
            $data['token'] =  $user->createToken('OURNews')->plainTextToken;
            $data['first_name'] =  $user->first_name;

            return response()->respondSuccess($data, 'User login successfully.');
        }

        return response()->respondBadRequest([], 'Invalid email or password. Please try again.');
    }

    /**
     * User logout api
     *
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $accessToken = $request->bearerToken();
        if ($accessToken) {
            $token = PersonalAccessToken::findToken($accessToken);

            if ($token && $token->delete()) {
                return response()->respondSuccess([], 'User logout successfully.');
            }
        }

        return response()->respondBadRequest([], 'Something went wrong.');
    }

    /**
     * User detail api
     *
     * @return \Illuminate\Http\Response
     */
    public function detail(Request $request)
    {
        $vtoken = Str::random(10);
        return response()->respondSuccess(
            ['vtoken' => $vtoken],
            'User details.'
        );
    }
}
