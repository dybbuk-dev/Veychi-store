<?php

namespace Marvel\Database\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class LegalRepresentative extends Model
{
    protected $table = 'legal_representative';
    public $timestamps = false;

    public $guarded = ["isApproved"];

    protected $fillable = ["id","name", "phone","dni_document_id"];

    public function dni_document():HasOne
    {
        return $this->hasOne(DniDocument::class,'id','dni_document_id');
    }
}
