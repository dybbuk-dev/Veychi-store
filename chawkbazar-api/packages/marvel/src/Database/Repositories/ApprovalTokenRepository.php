<?php

namespace Marvel\Database\Repositories;

use Marvel\Database\Models\ApprovalTokens;

class ApprovalTokenRepository extends BaseRepository
{

    protected $fieldSearchable = ['token' => '='];


    public function model(): string
    {
        return ApprovalTokens::class;
    }

}
