<?php

namespace Marvel\Database\Repositories;
use Illuminate\Support\Facades\Validator;
use Marvel\Database\Models\TicketComments;
use Marvel\Exceptions\MarvelException;
use Prettus\Repository\Criteria\RequestCriteria;

/**
 * Class TicketCommentsRepository.
 *
 * @package namespace App\Repositories;
 */
class TicketCommentsRepository extends BaseRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    protected $dataArray=[
        'ticket_id',
        'body',
        'author_id'
    ];
    private function validationFields(){
        return [
            'ticket_id'=>'required|exists:tickets,id',
            'body'=>'required|max:2500'
        ];
    }
    public function model()
    {
        return TicketComments::class;
    }

    /**
     * @throws MarvelException
     */
    public function saveComment($request){
        $this->validateRequest($request);
        $request["author_id"] = $request->user()->id;
        return $this->create($request->only($this->dataArray));
    }

    public function validateRequest($request){
        $validator =Validator::make($request->all(),$this->validationFields());
        if($validator->fails()) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
    }
    public function editComment($comment,$request){
        $this->validateRequest($request);
        $comment->update($request->only($this->dataArray));
        return $comment;
    }



    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

}
