<!DOCTYPE html>
<html>

<head>
    <title>Welcome to OUR News!</title>
</head>

<body>
    <h2>Welcome to OUR News!</h2>
    <p>Your temporary account credentials are as follows:</p>
    <p>
        Email: {{ $data['email'] }}
        <br>
        Password: {{ $data['temporary_password'] }}
    </p>
    <p>Please make sure to change your password after logging in for the better account security.</p>
    <p>Thank you!</p>
</body>

</html>