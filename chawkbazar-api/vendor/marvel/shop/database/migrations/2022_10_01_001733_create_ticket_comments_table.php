<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

/**
 * Class CreateTicketCommentsTable.
 */
class CreateTicketCommentsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('ticket_comments', function(Blueprint $table) {
            $table->id();
            $table->text('body');
            $table->unsignedBigInteger("ticket_id");
             $table->unsignedBigInteger("author_id");
            $table->timestamps();
            $table->foreign('ticket_id')
                ->references('id')
                ->on('tickets');
            $table->foreign('author_id')
                ->references('id')
                ->on('users');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('ticketCommentsController');
	}
}
