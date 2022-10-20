<?php

namespace Marvel\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
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
           return $this->repository->with('shops')->findOrFail($id);
       }
       catch (Exception $ex) {
           throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');

       }
   }
    public function store(Request $request)
    {
        return $this->repository->create(['token'=>Str::random(10)]);
    }

    public function destroy(int $id){
        try{
            return $this->repository->findOrFail($id)->delete();
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }
}
