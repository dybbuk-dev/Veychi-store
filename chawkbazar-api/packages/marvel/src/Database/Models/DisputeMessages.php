<?php

namespace Marvel\Database\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class DisputeMessages extends Model
{
    use SoftDeletes;
 protected $fillable=['dispute_id' ,'sender_id','type','content'];
 public $timestamps=true;

 public function dispute():hasOne{
     return $this->hasOne(Dispute::class,'id','dispute_id');
 }

}
