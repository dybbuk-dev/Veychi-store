<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class LegalRepresentative extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */

    private $table_name='legal_representative';
    public function up()
    {
        Schema::create($this->table_name, function (Blueprint $table) {
            $table->id();
            $table->bigInteger('dni_document_id')->unsigned();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->foreign('dni_document_id')->references('id')->on('dni_document');
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
