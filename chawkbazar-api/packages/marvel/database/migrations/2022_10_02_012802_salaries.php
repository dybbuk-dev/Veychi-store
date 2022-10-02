<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Salaries extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    private $table_name='salaries';
    public function up()
    {   Schema::create($this->table_name,function(Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('salary');
        $table->unsignedBigInteger('user_id');
        $table->enum('payment_status',['payed','pending'])->default('pending');
        $table->dateTime('payment_date');
        $table->foreign('user_id')->references('id')->on('users');
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
