<?php

namespace App\Enums;

enum UserRole: int
{
    case SuperAdmin = 1;
    case Admin = 2;
    case Moderator = 3;
    case Reporter = 4;
    case User = 5;
}
