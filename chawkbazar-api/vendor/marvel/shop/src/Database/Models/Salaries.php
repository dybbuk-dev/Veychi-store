<?php

namespace Marvel\Database\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Salaries extends Model
{
    protected $table='salaries';

    protected $fillable=["user_id","salary","payment_status","payment_date"];
    public $timestamps=false;


    public function user():hasOne {
        return $this->hasOne(User::class,'id','user_id');
    }

}
