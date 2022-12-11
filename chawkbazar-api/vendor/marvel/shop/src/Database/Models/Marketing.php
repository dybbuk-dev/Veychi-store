<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;

class Marketing extends Model
{
    public $timestamps=false;
    protected $table="marketing_images";
    protected $fillable=["title","text", "text_position", "slug", "subtitle", "subtitle_position", "image", "type"];
    protected $casts=["image"=>'array'];

}
