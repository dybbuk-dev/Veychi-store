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


    public function createMarketing($request)
    {
        $validator=Validator::make($request->all(),[
            'image'=>"required",
            'area'=>'required|max:191',
            'text'=>'nullable',
            "text_position"=>'nullable|max:20'
        ]);
        if($validator->fails())   throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        $url=$this->base64ImageResolver($request->image,Str::slug(Carbon::now()."-".$request->area));

        return $this->create([
            'url'=> $url,
            'area'=>$request->area,
            'text'=>$request->text,
            'text_position'=>$request->text_position
        ]);
    }

    private function validationFields(){
        return [
            'image'=>"required",
            'area'=>'required|max:191',
            'text'=>'nullable',
            'text_position'=>'nullable',
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
            Storage::delete($marketing->url);
            $url=$this->base64ImageResolver($request->image,Str::slug(Carbon::now()."-".$request->area));
            $marketing->url=$url;
            $marketing->area=$request->area;
            $marketing->text=$request->text;
            $marketing->text_position=$request->text_position;
            $marketing->save();
            return $marketing;
        }catch (Exception $ex){
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }

    }


}
