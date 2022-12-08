<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_user_id');
            $table->string('title');
            $table->text('content');
            $table->string('photo')->nullable();
            $table->dateTime('publish_date')->nullable();
            $table->tinyInteger('status')
                ->comment('1 - draft, 2 - for approval, 3 - for revision, 4 - published, 5 - archived');
            $table->text('notes')->nullable();
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
        Schema::dropIfExists('articles');
    }
};
