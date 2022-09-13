<?php

namespace Marvel\Database\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Marvel\Http\Controllers\CompanyController;

class ApprovalTokens extends Model
{
    protected $table = 'approval_tokens';

    public $guarded = ["token","id"];
    protected $hidden=['deleted_at'];
    protected $fillable =['token'];
    public $timestamps = false;

    /**
     * @return BelongsTo
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'approval_token_id');
    }
}
