<?php

namespace Marvel\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Marvel\Database\Repositories\ApprovalTokenRepository;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\ApprovalTokenCreateRequest;
use Omnipay\Common\Http\Exception;

class ApprovalTokenController extends CoreController
{
    private $repository;
    public function __construct(ApprovalTokenRepository $repository)
    {
        $this->repository = $repository;
    }

   public function index(Request $request){
       $limit = $request->limit ?: 15;
       return $this->repository->with('shops')->paginate($limit);
   }

   public function show($id){
       try {
           $target=$this->repository->with('shops')->findOrFail($id);
           $target->validity = new Carbon($target->validity);
           $now = Carbon::parse(Carbon::now()->format('Y-m-d'));
           $target->validity=$now->diffInDays($target->validity,false);
           if($target->validity<0)$target->validity=0;
           return $target;
       }
       catch (Exception $ex) {
           throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');

       }
   }

    /**
     * @throws MarvelException
     */
    public function update(Request $request, $id){
        $request->merge(['id'=>$id]);
        $validation = Validator::make($request->all(),[
            'responsible'=>'required',
            'validity'=>'required|numeric|min:1',
            'id'=>'required|exists:approval_tokens,id'
        ]);
        if($validation->fails()) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.VALIDATION_ERROR');
        $token=$this->repository->find($request->id);
        $token->responsible = $request->responsible;
        $token->validity = Carbon::now()->addDays($request->validity);
        $token->save();
   }

    public function store(Request $request)
    {
        if($request->validity<=0) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.VALIDATION_ERROR');
        $validity= Carbon::now()->addDays($request->validity);
        $responsible=$request->responsible;
        return $this->repository
            ->create(['token'=>Str::random(10),
                'validity'=>$validity,
                'responsible'=>$responsible]);
    }

    public function destroy(int $id){
        try{
            return $this->repository->findOrFail($id)->delete();
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }
}
