<?php

namespace Marvel\Database\Repositories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Marvel\Database\Models\Ticket;
use Marvel\Enums\Permission;
use Marvel\Enums\ticketPriority;
use Marvel\Enums\ticketStatus;
use Marvel\Exceptions\MarvelException;
use Omnipay\Common\Http\Exception;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Validator\Exceptions\ValidatorException;


/**
 * Class TicketRepository.
 *
 * @package namespace App\Repositories;
 */
class TicketRepository extends BaseRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    protected $dataArray=[
        'title',
        'body',
        'status',
        'priority',
        'shop_id',
        'author_id'
    ];

    private function validationFields():array{
        return  [
            'title'=>'required|max:191',
            'body'=>'required|max:2500',
            'status'=>['required',Rule::in([ticketStatus::CLOSED,ticketStatus::OPEN])],
            'priority'=>['required',Rule::in([ticketPriority::HIGH,ticketPriority::MEDIUM,ticketPriority::LOW])],
            'shop_id'=>'required|exists:shops,id'
        ];
    }
    public function model()
    {
        return Ticket::class;
    }

    /**
     * @throws MarvelException
     */
    public function createTicket($request)
    {
        try {
            if ($request->user()->hasPermissionTo(Permission::STAFF)) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
            $validator= Validator::make($request->all(),$this->validationFields());
            if($validator->fails()) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
            $save=$request->only($this->dataArray);
            $save["author_id"]=$request->user()->id;
            return $this->create($save);
        } catch (ValidatorException $e) {
                throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }

    public function getTicket(int $id,  $request)
    {

            $ticket = $this->find($id);
            if(!$ticket)  throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
            if ($request->user()->hasPermissionTo(Permission::STAFF)) return $this->with(['comments','shop'])->where([
                ['shop_id', "=", $request->user()->shop_id],
                ['id', "=", $ticket->id]
            ]);
        if ($request->user()->hasPermissionTo(Permission::CUSTOMER)) return $this->with(['comments','shop'])->where([
            ['author_id', "=", $request->user()->id],
            ['id', "=", $ticket->id]
        ]);


    }
    /**
     * @throws MarvelException
     */
    public function updateTicket($request, $ticket){
        try{
            $toUpdate= $this->dataArray;
            $validator= Validator::make($request->all(),$this->validationFields());
            if($request->user()->hasPermissionTo(Permission::STAFF)){
                $toUpdate= ['status', 'priority'];
                $validatorFields=$this->validationFields();
                unset($validatorFields['title']);
                unset($validatorFields["body"]);
                $validator = Validator::make($request->all(),$validatorFields);
            }
           if($validator->fails()) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.VALIDATION_ERROR');
           $ticket->update($request->only($toUpdate));
           return $ticket;
        }catch (Exception $ex){
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }


}
