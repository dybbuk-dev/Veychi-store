<?php


namespace Marvel\Database\Repositories;

use Illuminate\Support\Facades\Validator;
use Marvel\Database\Models\Dispute;
use Marvel\Database\Models\DisputeMessages;
use Marvel\Database\Models\Order;
use Marvel\Enums\Permission;
use Marvel\Exceptions\MarvelException;
use Prettus\Validator\Exceptions\ValidatorException;

class DisputeRepository extends BaseRepository
{
    /**
     * Configure the Model
     **/
    public function model()
    {
        return Dispute::class;
    }
    private $dataArray=[
    'purchase_id'
    ];
    private $dataArrayMessage = [
      'dispute_id',
      'type',
      'content',
      'sender_id'
    ];
    private function validate(): array
    {
        return [
            'purchase_id'=>'required|exists:orders,id'
        ];
    }
    private function validateMessage(){
        return [
            'dispute_id'=>'required|exists:dispute,id',
            'type'=>'required',
            'content'=>'required'
        ];
    }
    private function validateUpdate(): array
    {
        return [
            'purchase_id'=>'required|exists:orders,id',
            'id' => 'required|exists:dispute,id',
            'status'=>'required'
        ];
    }
    /**
     * @throws MarvelException
     */
    public function getDisputes($limit, $request){
        try{
            if($request->user()->hasPermissionTo(Permission::STORE_OWNER)){
                $shops = $request->user()->shops()->pluck('id');
                $orders = Order::whereIn('shop_id',$shops)->pluck('id');
                return $this->whereIn('purchase_id',$orders)->with('messages')->paginate($limit);
            }
            if($request->user()->hasPermissionTo(Permission::CUSTOMER)){
                $orders = Order::where('customer_id',$request->user()->id)->pluck('id');
                return $this->whereIn('purchase_id',$orders)->with('messages')->paginate($limit);
            }
        }catch (\Exception $ex){
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }

    }

    /**
     * @throws MarvelException
     * @throws ValidatorException
     */
    public function createDispute($request){
        if(!$request->user()->hasPermissionTo(Permission::CUSTOMER)) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        $validate=Validator::make($request->all(),$this->validate());
        if($validate->fails()) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        if(!Order::where([
            ['id',"=",$request->purchase_id],
            ['customer_id','=',$request->user()->id]
        ])->first()) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        return  $this->create($request->only($this->dataArray));
    }

    /**
     * @throws MarvelException
     */
    public function updateDispute($request){

        if(!$request->user()->hasPermissionTo(Permission::CUSTOMER)) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
       $validate=Validator::make($request->all(),$this->validateUpdate());
       if($validate->fails()) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        $dispute=$this->find($request->id);
        $dispute->status=$request->status;
        $dispute->save();
        return $dispute;
    }

    public function addMessage($request) {
        $validator=Validator::make($request->all(),$this->validateMessage());
        if($validator->fails()) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        $request->merge(['sender_id'=>$request->user()->id]);
        $message=DisputeMessages::create($request->only($this->dataArrayMessage));
        return $message;
    }

    public function deleteMessage($id){
        DisputeMessages::destroy($id);
    }
}
