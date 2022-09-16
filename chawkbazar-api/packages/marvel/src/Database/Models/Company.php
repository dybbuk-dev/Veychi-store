<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Company extends Model
{
    protected $table = 'company';
    public $timestamps=true;
    protected $fillable=["user_id","dni_document_id","legal_representative_id","name", "line_of_business", "physical_address", "fiscal_address", "tax_country", "business_phone", "products_description"];
    protected $hidden = [

        'created_at',
        'updated_at',
    ];
    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id','user_id');
    }

    public function legal_representative(): HasOne
    {
        return $this->hasOne(LegalRepresentative::class,'id','legal_representative_id');
    }
    public function dni_document():HasOne
    {
        return $this->hasOne(DniDocument::class,'id','dni_document_id');
    }


}
