<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class MarketingImages extends Migration
{

    protected $table_name="marketing_images";
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create($this->table_name, function (Blueprint $table) {
            $table->id();
            $table->string('title',200);
            $table->json('image');
            $table->string('type');
            $table->text('text')->nullable();
            $table->string('text_position',20)->nullable();
            $table->string('slug',25);
            $table->string('subtitle',200)->nullable();
            $table->string('subtitle_position',20)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('failed_jobs');
    }
}
