<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PremiumPlans extends Model
{
    use SoftDeletes;

 protected $table ="premium_plans";
 public $timestamps=true;
 protected $fillable =[
     "title",
     "price",
     "duration",
     "order",
     "traits",
     "popular"
 ];

 protected $casts=[
     "traits"=>'array',
     'popular'=>'boolean'
 ];

}
