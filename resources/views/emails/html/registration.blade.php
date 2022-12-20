<!DOCTYPE html>
<html>

<head>
    <title>Welcome to OUR News!</title>
</head>

<body>
    <h2>Welcome to OUR News!</h2>
    <p>Please verify your account using the information below:</p>
    <p>
        Email: {{ $data['email'] }}
        <br>
        Token: {{ $data['verification_token'] }}
    </p>
    <p>Thank you!</p>
</body>

</html>