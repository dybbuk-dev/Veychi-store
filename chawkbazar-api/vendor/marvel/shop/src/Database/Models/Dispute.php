<?php

namespace Marvel\Database\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dispute extends Model
{
    protected $maps=['id'=>'dispute_id'];
    protected $table='dispute';
    use SoftDeletes;
 protected $fillable=["purchase_id","status"];
 public $timestamps=true;

 public function messages():hasMany{
     return $this->hasMany(DisputeMessages::class,'dispute_id','id');
 }

 public function order():hasOne{
     return $this->hasOne(Order::class,'id','purchase_id')->with(['shop']);
 }
 public function order_parent():hasOne{
     return $this->hasOne(Order::class,'parent_id','purchase_id')->with(['shop']);
 }
}
