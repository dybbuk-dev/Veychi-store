<?php

namespace Marvel\Database\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TicketComments extends Model
{
  protected $table="ticket_comments";
  protected $fillable=["body","author_id","ticket_id"];
  public $timestamps=true;
  public function ticket():hasOne{
      return $this->hasOne(Ticket::class,'id',"ticket_id");
  }
  public function author():hasOne{
      return $this->hasOne(User::class,'author_id','id');
  }
}
