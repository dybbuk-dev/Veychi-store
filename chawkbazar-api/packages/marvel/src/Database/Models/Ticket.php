<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use SoftDeletes;
 protected $table="tickets";

 protected $fillable= ["title","body","status","priority","author_id","shop_id"];
 public $timestamps=true;

 public function author():hasOne {
     return $this->hasOne(User::class,'id','author_id');
 }
 public function shop():hasOne{
    return $this->hasOne(Shop::class,'id','shop_id');
 }
 public function comments():hasMany{
   return   $this->hasMany(TicketComments::class,'ticket_id','id');
 }
}
