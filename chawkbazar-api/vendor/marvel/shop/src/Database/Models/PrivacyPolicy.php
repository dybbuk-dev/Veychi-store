<?php


namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PrivacyPolicy extends Model
{
    use softDeletes;
    protected $table="privacy_policy";

    protected $fillable=["pdf","text"];


}
