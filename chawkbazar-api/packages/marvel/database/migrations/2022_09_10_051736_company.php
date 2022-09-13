<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Company extends Migration
{   private $table_name='company';
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create($this->table_name, function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id')->unsigned();
            $table->bigInteger('legal_representative_id')->unsigned();
            $table->bigInteger('dni_document_id')->unsigned();
            $table->string('name');
            $table->string('line_of_business')->nullable();
            $table->string('physical_address')->nullable();
            $table->string('fiscal_address')->nullable();
            $table->string('tax_country')->nullable();
            $table->string('business_phone')->nullable();
            $table->string('products_description')->nullable();
            $table->boolean("isApproved")->default(false);
            $table->bigInteger("approval_token_id")->unsigned()->nullable();
            $table->timestamps();
            $table->foreign('user_id')
                ->references('id')
                ->on('users');
            $table->foreign('legal_representative_id')
                ->references('id')
                ->on('legal_representative');
            $table->foreign('dni_document_id')
                ->references('id')
                ->on('dni_document');
            $table->foreign('approval_token_id')
                ->references('id')
                ->on('approval_tokens');
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
