<?php


namespace Marvel\Database\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Countries extends Model
{
    protected $table = 'countries';
    protected $fillable = [
        "alpha_2",
        "alpha_3",
        "ar",
        "bg",
        "cs",
        "da",
        "de",
        "el",
        "en",
        "eo",
        "es",
        "et",
        "eu",
        "fi",
        "fr",
        "hu",
        "hy",
        "it",
        "ja",
        "ko",
        "lt",
        "nl",
        "no",
        "pl",
        "pt",
        "ro",
        "ru",
        "sk",
        "sv",
        "th",
        "uk",
        "zh",
        "zh-tw",
    ];

public function shops():HasMany
{
    return $this->hasMany(Shop::class,'country_id','id');
}

}
