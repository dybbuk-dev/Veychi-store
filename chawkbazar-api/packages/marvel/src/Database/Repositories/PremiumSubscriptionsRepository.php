<?php

namespace Marvel\Database\Repositories;

use Carbon\Carbon;
use Marvel\Database\Models\PremiumSubscriptions;
use Illuminate\Support\Facades\Validator;
use Marvel\Database\Models\Shop;
use Marvel\Enums\Permission;
use Marvel\Exceptions\MarvelException;

class PremiumSubscriptionsRepository extends BaseRepository
{


    private $dataArray=[
        "provider", "url", "password", "domain","shop_id","purchase_date", "end_date"
    ];
    public function Validations():array{
        return [
            'provider'=>'required',
            'url'=>'required',
            'password'=>'required',
            'domain'=>'required',
            'shop_id'=>'required|exists:shops,id',
            'owner_id'=>'required|exists:shops,owner_id',
            'days'=>'required|numeric|min:30|max:365'
        ];
    }

    /**
     * @throws MarvelException
     */

    private function isAdmin($user){
         return $user->hasPermissionTo(Permission::SUPER_ADMIN)||
                $user->hasPermissionTo(Permission::CEO)||
                $user->hasPermissionTo(Permission::MANAGEMENT)||
                $user->hasPermissionTo(Permission::LEGAL)||
                $user->hasPermissionTo(Permission::MANAGER_RH)||
                $user->hasPermissionTo(Permission::SHAREHOLDER)||
                $user->hasPermissionTo(Permission::MARKETING);
    }

    /**
     * @throws MarvelException
     */
    public function indexPremiumSubscriptions($request){
        if(!$this->isAdmin($request->user()))  throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        $limit=$request->limit?:15;
       return $this->paginate($limit);
    }

    /**
     * @throws MarvelException
     */
    public function showPremiumSubscription($request, $id){
        if($this->isAdmin($request->user())){
            return $this->firstWhere('shop_id',$id);
        }

        $shop=Shop::firstWhere('owner_id',$request->user()->id);
        if(!$shop)  throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        return $this->firstWhere('shop_id',$shop->id);

    }

    /**
     * @throws MarvelException
     */
    private function makePremium($shop){
        $shop->premium=true;
        $shop->save();
        return $shop;
    }
    private function validate($request){

        $validation =Validator::make($request->all(),$this->Validations());
        $shop = Shop::find($request->shop_id);
        if(!$shop) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        if($shop->owner_id!==$request->user()->id) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.UNAUTHORIZED');
        if($validation->fails())   throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.VALIDATION_ERROR');
        return $shop;
    }
    public function storeSubscription($request){
        $shop = $this->validate($request);
        if(!$shop)   throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        $request->merge(['purchase_date'=>Carbon::now(),'end_date'=>Carbon::now()->addDays($request->days)]);
        $subscription=$this->create($request->only($this->dataArray));
        $this->makePremium($shop);
        return $subscription;
    }

    public function updateSubscription($request){
        $this->validate($request);
        $susbciption=$this->findOrFail($request->id);
        $susbciption->url=$request->url;
        $susbciption->provider=$request->provider;
        $susbciption->password = $request->password;
        $susbciption->domain = $request->domain;
        $susbciption->shop_id = $request->shop_id;
        $susbciption->purchase_date=Carbon::now();
        $susbciption->end_date =Carbon::now()->addDays($request->days);
        $susbciption->save();
        return $susbciption;
    }

    /**
     * @throws MarvelException
     */
    public function cancelPremium($request, $id){
        $shop=Shop::find($id);
        $shop->premium=false;
        $shop->premium_plan_id=null;
        $shop->save();
    }

    public function model(): string
    {
        return PremiumSubscriptions::class;
    }
}
