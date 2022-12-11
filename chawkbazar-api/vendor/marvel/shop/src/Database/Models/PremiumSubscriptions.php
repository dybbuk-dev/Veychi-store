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
    protected $fillable=["provider","user", "url", "password", "domain", "purchase_date", "end_date","shop_id",'plan_id'];

    /**
     * @return BelongsTo
     */
    public function shops(): hasOne
    {
        return $this->hasOne(Shop::class, 'id','shop_id');
    }

    public function plans(): hasOne
    {
        return $this->hasOne(PremiumPlans::class, 'id','plan_id');
    }


}
