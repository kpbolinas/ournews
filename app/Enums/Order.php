<?php

namespace App\Enums;

enum Order: int
{
    case Latest = 1;
    case Oldest = 2;
}
