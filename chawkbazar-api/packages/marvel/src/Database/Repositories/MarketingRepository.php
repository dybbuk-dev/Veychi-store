<?php

namespace Marvel\Database\Repositories;

use Carbon\Carbon;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Marvel\Database\Models\Marketing;
use Marvel\Exceptions\MarvelException;
use Omnipay\Common\Http\Exception;
use Prettus\Validator\Exceptions\ValidatorException;

/**
 * Class MarketingRepository.
 *
 * @package namespace App\Entities;
 */
class MarketingRepository extends BaseRepository
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $dataArray = [];

    public function model(): string
    {
        return Marketing::class;
    }


    /**
     * @throws MarvelException
     * @throws ValidatorException
     */
    public function createMarketing($request)
    {
        $validator=Validator::make($request->all(),[
            'title'=>"required",
            'image'=>"required",
            'type'=>'required|max:191',
            'text'=>'nullable',
            "text_position"=>'nullable|max:20',
            "slug"=>'nullable|max:191',
            "subtitle"=>'nullable|max:200',
            "subtitle_position"=>'nullable|max:20',
        ]);
        if($validator->fails())  throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
              return $this->create([
                  'title'=>$request->title,
                  'text'=>$request->text,
                  'text_position'=>$request->text_position,
                  'slug'=>$request->slug,
                  'subtitle'=>$request->subtitle,
                  'subtitle_position'=>$request->subtitle_position,
                  'image'=>$request->image,
                  'type'=>$request->type,

        ]);
    }

    private function validationFields(){
        return [
            'title'=>"required",
            'image'=>"required",
            'type'=>'required|max:191',
            'text'=>'nullable',
            "text_position"=>'nullable|max:20',
            "slug"=>'nullable|max:191',
            "subtitle"=>'nullable|max:200',
            "subtitle_position"=>'nullable|max:20',
            "id"=>'exists:marketing_images,id'
        ];
    }

    /**
     * @param $request
     * @param $marketing Model
     * @return Model
     * @throws MarvelException
     */
    public function updateMarketing($request, Model $marketing){
        try{
            $validation = Validator::make($request->all(),$this->validationFields());
            if($validation->fails())throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
            $marketing->title=$request->title;
            $marketing->image=$request->image;
            $marketing->type=$request->type;
            $marketing->text=$request->text;
            $marketing->text_position=$request->text_position;
            $marketing->slug=$request->slug;
            $marketing->subtitle=$request->subtitle;
            $marketing->subtitle_position=$request->subtitle_position;
            $marketing->save();
            return $marketing;
        }catch (Exception $ex){
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }

    }


}
