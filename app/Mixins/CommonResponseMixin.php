<?php

namespace App\Mixins;

class CommonResponseMixin
{
    /**
     * Set success response
     *
     * @param array  $data    Response data. Defaults to empty array.
     * @param string $messageId Response message id. Defaults to 'SUCCESS'.
     * @param string $message Response message. Defaults to null.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function respondSuccess()
    {
        return function ($data = [], $message = null) {
            return $this->setResponse([
                'status' => 200,
                'message' => $message ?? __('Success'),
                'data' => $data
            ]);
        };
    }

    /**
     * Set accepted response
     *
     * @param array $data Response data. Defaults to empty array.
     * @param string $messageId Response message id. Defaults to 'ACCEPTED'.
     * @param string $message Response message. Defaults to null.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function respondAccepted()
    {
        return function ($data = [], $message = null) {
            return $this->setResponse([
                'status' => 202,
                'message' => $message ?? __('Accepted'),
                'data' => $data
            ]);
        };
    }

    /**
     * Set invalid parameters response
     *
     * @param array  $data    Response data. Defaults to empty array.
     * @param string $messageId Response message id. Defaults to 'INVALID_PARAMETERS'.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function respondInvalidParameters()
    {
        return function ($data = [], $message = null) {
            return $this->setResponse([
                'status' => 422,
                'message' => $message ?? __('Invalid Parameters'),
                'data' => $data
            ]);
        };
    }

    /**
     * Set bad request response
     *
     * @param string $messageId Response message id. Defaults to 'BAD_REQUEST'.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function respondBadRequest()
    {
        return function ($data = [], $message = null) {
            return $this->setResponse([
                'status' => 400,
                'message' => $message ?? __('Bad Request'),
                'data' => $data
            ]);
        };
    }

    /**
     * Set unauthorized response
     *
     * @param string $messageId Response message id. Defaults to 'UNAUTHORIZED'.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function respondUnauthorized()
    {
        return function ($message = null) {
            return $this->setResponse([
                'status' => 401,
                'message' => $message ?? __('Unauthorized'),
            ]);
        };
    }

    /**
     * Set forbidden response
     *
     * @param string $messageId Response message id. Defaults to 'FORBIDDEN'.
     * @param string $message Response message. Defaults to null.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function respondForbidden()
    {
        return function ($data = [], $message = null) {
            return $this->setResponse([
                'status' => 403,
                'message' => $message ?? __('Forbidden'),
                'data' => $data
            ]);
        };
    }

    /**
     * Set not found response
     *
     * @param array $data Response data. Defaults to empty array.
     * @param string $messageId Response message id. Defaults to 'NOT_FOUND'.
     * @param string $message Response message. Defaults to null.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function respondNotFound()
    {
        return function ($data = [], $message = null) {
            return $this->setResponse([
                'status' => 404,
                'message' => $message ?? __('Not Found'),
                'data' => $data
            ]);
        };
    }

    /**
     * Set method not found response
     *
     * @param string $messageId Response message id. Defaults to 'METHOD_NOT_ALLOWED'.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function respondMethodNotFound()
    {
        return function () {
            return $this->setResponse([
                'status' => 405,
                'message' => $message ?? __('Method Not Allowed'),
            ]);
        };
    }

    /**
     * Set conflict response
     *
     * @param array $data Response data. Defaults to empty array.
     * @param string $messageId Response message id. Defaults to 'CONFLICT'.
     * @param string $message Response message. Defaults to null.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function respondConflict()
    {
        return function ($data = [], $message = null) {
            return $this->setResponse([
                'status' => 409,
                'message' => $message ?? __('Conflict'),
                'data' => $data
            ]);
        };
    }

    /**
     * Set internal server error response
     *
     * @param string $messageId Response message id. Defaults to 'INTERNAL_SERVER_ERROR'.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function respondInternalServerError()
    {
        return function ($data = [], $message = null) {
            return $this->setResponse([
                'status' => 500,
                'message' => $message ?? __('Server Error'),
                'data' => $data
            ]);
        };
    }

    /**
     * Set response
     *
     * @param array  $options   Array of response options
     *      $options = [
     *          'status'        => (int) Response status code. Defaults to 200.
     *          'message'       => (string) Response message. Defaults to null.
     *          'data'          => (array?) Response data. Defaults to empty array.
     *      ]
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function setResponse()
    {
        return function ($options) {
            // Set response headers
            $headers = [
                'Content-Type' => 'application/json',
            ];

            // Set default values
            $status = $options['status'] ?? 200;

            // Initialize response array
            $response = ['status' => $status];

            // Attach data if passed
            if (isset($options['data'])) {
                $response['data'] = $options['data'];
            }

            if (!empty($options['message'])) {
                $response['message'] = __($options['message']);
            }

            return $this->json($response, $status, $headers);
        };
    }
}
