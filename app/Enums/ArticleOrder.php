<?php

namespace App\Enums;

enum ArticleOrder: int
{
    case Latest = 1;
    case Oldest = 2;
}
