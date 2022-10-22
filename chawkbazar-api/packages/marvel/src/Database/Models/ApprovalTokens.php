<?php

namespace Marvel\Database\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Marvel\Http\Controllers\CompanyController;

class ApprovalTokens extends Model
{
    protected $table = 'approval_tokens';

    public $guarded = ["token","id"];
    protected $hidden=['deleted_at'];
    protected $fillable =['token','responsible', 'validity'];
    public $timestamps = true;

    /**
     * @return BelongsTo
     */
    public function shops(): HasMany
    {
        return $this->hasMany(Shop::class, 'approval_token_id');
    }
}
