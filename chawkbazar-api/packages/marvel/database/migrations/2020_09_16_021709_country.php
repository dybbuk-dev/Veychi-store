<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Country extends Migration
{
    private $table_name='countries';
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create($this->table_name,function(Blueprint $table){
        $table->id();
        $table->string('alpha_2',75)->nullable()->default('');
        $table->string('alpha_3',75)->nullable()->default('');
        $table->string('ar',75)->nullable()->default('');
        $table->string('bg',75)->nullable()->default('');
        $table->string('cs',75)->nullable()->default('');
        $table->string('da',75)->nullable()->default('');
        $table->string('de',75)->nullable()->default('');
        $table->string('el',75)->nullable()->default('');
        $table->string('en',75)->nullable()->default('');
        $table->string('eo',75)->nullable()->default('');
        $table->string('es',75)->nullable()->default('');
        $table->string('et',75)->nullable()->default('');
        $table->string('eu',75)->nullable()->default('');
        $table->string('fi',75)->nullable()->default('');
        $table->string('fr',75)->nullable()->default('');
        $table->string('hu',75)->nullable()->default('');
        $table->string('hy',75)->nullable()->default('');
        $table->string('it',75)->nullable()->default('');
        $table->string('ja',75)->nullable()->default('');
        $table->string('ko',75)->nullable()->default('');
        $table->string('lt',75)->nullable()->default('');
        $table->string('nl',75)->nullable()->default('');
        $table->string('no',75)->nullable()->default('');
        $table->string('pl',75)->nullable()->default('');
        $table->string('pt',75)->nullable()->default('');
        $table->string('ro',75)->nullable()->default('');
        $table->string('ru',75)->nullable()->default('');
        $table->string('sk',75)->nullable()->default('');
        $table->string('sv',75)->nullable()->default('');
        $table->string('th',75)->nullable()->default('');
        $table->string('uk',75)->nullable()->default('');
        $table->string('zh',75)->nullable()->default('');
        $table->string('zh-tw',75)->nullable()->default('');
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
