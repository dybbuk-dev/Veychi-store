<?php

namespace Marvel\Database\Repositories;

use Illuminate\Support\Facades\Validator;
use Marvel\Database\Models\PremiumPlans;
use Marvel\Database\Models\PremiumSubscriptions;
use Marvel\Exceptions\MarvelException;

class PremiumPlansRepository extends BaseRepository
{

    private $dataArray=[
        "title",
        "price",
        "duration",
        "order",
        "traits",
        "popular"
    ];

    private function validations():array{
        return [
          'title'=>'required',
            'price'=>'required',
            "duration"=>'required',
            "order"=>'required',
            "popular"=>'nullable',
            "traits"=>'required|array'
        ];
    }
    public function model()
    {
       return PremiumPlans::class;
    }

    /**
     * @throws MarvelException
     */
    public function storePlan($request){
        $validations=Validator::make($request->all(),$this->validations());
        if($validations->fails())  throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.VALIDATION_ERROR');
       return $this->create($request->only($this->dataArray));
    }

    /**
     * @throws MarvelException
     */
    public function updatePlan($request){
        $validation=Validator::make($request->only($this->dataArray),$this->validations());
        if($validation->fails())  throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.VALIDATION_ERROR');
        $plan=$this->findOrFail($request->id);
        $plan->title=$request->title;
        $plan->price=$request->price;
        $plan->duration =$request->duration;
        $plan->order =$request->order;
        $plan->popular =$request->popular;
        $plan->traits =$request->traits;
        $plan->save();
        return $plan;
    }
}
