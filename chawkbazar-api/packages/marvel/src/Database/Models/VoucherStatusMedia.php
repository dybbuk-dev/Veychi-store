<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class VoucherStatusMedia extends Model
{
    protected $table='voucher_status_media';
    public $timestamps=false;
    protected $fillable=['id_attachment','id_order','id_order_status'];

    public function attachments():belongsTo
    {
        return $this->belongsTo(Attachment::class,'id_attachment');
    }

    public function order():HasOne
    {
        return $this->hasOne(Order::class,'id','id_order');
    }

    public function status():HasOne
    {
        return $this->hasOne(OrderStatus::class,'id','id_order_status');
    }
}
