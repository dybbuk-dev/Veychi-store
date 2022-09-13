<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Company extends Model
{
    protected $table = 'company';
    public $guarded = ["isApproved","approval_token_id"];
    public $timestamps=true;
    protected $fillable=["isApproved","user_id","dni_document_id","legal_representative_id","name", "line_of_business", "physical_address", "fiscal_address", "tax_country", "business_phone", "products_description"];
    protected $hidden = [
        "approval_token_id",
        'created_at',
        'updated_at',
    ];
    public $casts=['isApproved'=>"boolean"];
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

    public function approvalToken(): hasOne
    {
        return $this->hasOne(ApprovalTokens::class, 'id','approval_token_id');
    }
}
