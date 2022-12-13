<?php

namespace App\Enums;

enum ArticleStatus: int
{
    case Draft = 1;
    case ForApproval = 2;
    case ForRevision = 3;
    case Published = 4;
    case Archived = 5;
}
