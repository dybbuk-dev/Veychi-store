<?php

namespace Marvel\Database\Repositories;

use Carbon\Carbon;
use http\Env\Request;
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

        $url=$this->base64ImageResolver($request->image,Str::slug(Carbon::now()."-".$request->area));
        return $this->create([
            'url'=> $url,
            'area'=>$request->area,
            'text'=>$request->text,
        ]);
    }

    private function validationFields(){
        return [
            'url'=>"required",
            'area'=>'required|max:191',
            'text'=>'nullable'
        ];
    }

    /**
     * @param $request
     * @param $marketing Model
     * @return Model
     * @throws MarvelException
     */
    public function updateMarketing($request, Model $marketing):Model{
        try{
            $validation = Validator::make($request->all(),$this->validationFields());
            if($validation->fails())throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
            Storage::delete($marketing->url);
            $url=Storage::put($marketing->url,$request->image);
            $marketing->url=$url;
            $marketing->area=$request->area;
            $marketing->text-=$request->text;
            $marketing->save();
            return $marketing;
        }catch (Exception $ex){
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }

    }


}
