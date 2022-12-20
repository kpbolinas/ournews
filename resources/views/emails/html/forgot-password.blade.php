<!DOCTYPE html>
<html>

<head>
    <title>OUR News - Forgot Password Verification</title>
</head>

<body>
    <h2>Good day!</h2>
    <p>You may reset the password of your account using the information below:</p>
    <p>
        Email: {{ $data['email'] }}
        <br>
        Token: {{ $data['verification_token'] }}
    </p>
    <p>
        You will receive another email containing the new and temporary password of your account after the reset password verification.
    </p>
    <p>Thank you!</p>
</body>

</html>