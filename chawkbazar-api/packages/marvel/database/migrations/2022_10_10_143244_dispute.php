<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Dispute extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    private $table_name='dispute';

    public function up()
    {
        Schema::create($this->table_name,function(Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('purchase_id');
            $table->enum('status',['opened','closed','awaiting_response'])->default('opened');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('purchase_id')->references('id')->on('orders');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists($this->table_name);
    }
}
