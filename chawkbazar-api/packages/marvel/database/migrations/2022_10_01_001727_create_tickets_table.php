<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateTicketsTable.
 */
class CreateTicketsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('tickets', function(Blueprint $table) {
            $table->id();
            $table->string("title");
            $table->text("body");
            $table->enum("status",["open","closed"]);
            $table->enum("priority",["low","medium","high"]);
            $table->unsignedBigInteger("author_id");
            $table->unsignedBigInteger("shop_id");
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('author_id')
                ->references('id')
                ->on('users');
            $table->foreign('shop_id')
                ->references('id')
                ->on('shops');

		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('tickets');
	}
}
