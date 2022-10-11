<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ProofVoucher extends Migration
{
    private $table_name="voucher_status_media";
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create($this->table_name,function(Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_attachment');
            $table->unsignedBigInteger('id_order');
            $table->unsignedBigInteger('id_order_status');
            $table->foreign('id_attachment')->references('id')->on('attachments');
            $table->foreign('id_order')->references('id')->on('orders');
            $table->foreign('id_order_status')->references('id')->on('order_status');
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
