<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class PremiumSubscriptions extends Model
{
    protected $table = 'premium_subscriptions';
    use SoftDeletes;
    protected $fillable=["provider", "url", "password", "domain", "purchase_date", "end_date","shop_id"];

    /**
     * @return BelongsTo
     */
    public function shops(): hasOne
    {
        return $this->hasOne(Shop::class, 'id','shop_id');
    }


}
