<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class PremiumPlans extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    private $table_name="premium_plans";
    public function up()
    {
        Schema::create($this->table_name,function (Blueprint $table){
            $table->id();
            $table->string("title");
            $table->unsignedBigInteger("price")->nullable();
            $table->unsignedBigInteger("duration");
            $table->unsignedBigInteger("order")->nullable();
            $table->boolean("popular")->default(false);
            $table->json("traits")->nullable();
            $table->timestamps();
            $table->softDeletes();
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
