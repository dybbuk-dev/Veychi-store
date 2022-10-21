<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class PremiumSubscriptions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */

    private $table_name="premium_subscriptions";
    public function up()
    {
        /*
        * proveedor
        * url
        * usuario/correo
        * contraseña
        * dominio
        * fecha de compra
        * fecha de fin
        *
        */
        Schema::create($this->table_name,function (Blueprint $table){
            $table->id();
            $table->string("provider");
            $table->string("url",200)->nullable();
            $table->string("password",300);
            $table->string("domain")->nullable();
            $table->dateTime("purchase_date")->nullable();
            $table->dateTime("end_date")->nullable();
            $table->unsignedBigInteger('shop_id');
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
