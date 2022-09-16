<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ProductHasReviews extends Migration
{
    private $table="product_has_customer_review";
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create($this->table,function(Blueprint $table){
           $table->id();
           $table->unsignedBigInteger('customer_review_id');
           $table->unsignedBigInteger('product_id');
            $table->foreign('customer_review_id')
                ->references('id')
                ->on('customer_review');
            $table->foreign('product_id')
                ->references('id')
                ->on('products');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
