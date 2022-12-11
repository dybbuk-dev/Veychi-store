<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Relations\HasOne;
use \Illuminate\Database\Eloquent\Model;

class DniDocument extends Model
{
    protected $table='dni_document';

    protected $fillable = ["DNI", "DNI_document_path"];

    public $timestamps = false;

    public function legal_representative(): HasOne
    {
        return $this->hasOne(LegalRepresentative::class,'dni_document_id','id');
    }

    public function company(): HasOne
    {
        return $this->hasOne(Company::class,'dni_document_id','id');
    }
}
