<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DisputeMessages extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    private $table_name="dispute_messages";
    public function up()
    {
        Schema::create($this->table_name,function(Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dispute_id');
            $table->unsignedBigInteger('sender_id');
            $table->string('type')->default('text');
            $table->text("content");
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('sender_id')->references('id')->on('users');
            $table->foreign('dispute_id')->references('id')->on('dispute');
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
