<?php

namespace App\Enums;

enum MailStatus: int
{
    case Unread = 0;
    case Read = 1;
}
