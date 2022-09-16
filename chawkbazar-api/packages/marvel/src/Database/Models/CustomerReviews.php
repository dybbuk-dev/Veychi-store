<?php

namespace Marvel\Database\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerReviews extends Model
{
    use SoftDeletes;
    protected $table = 'customer_review';
    public $timestamps=true;
    protected $fillable=["user_id","comment","score"];
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function productsHasReview():BelongsToMany{
        return $this->belongsToMany(Product::class,'product_has_customer_review','product_id','customer_review_id','id');
    }
}
