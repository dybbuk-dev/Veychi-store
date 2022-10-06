<?php

namespace Marvel\Http\Controllers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Marvel\Database\Models\Marketing;
use Marvel\Database\Repositories\MarketingRepository;
use Marvel\Exceptions\MarvelException;
use Omnipay\Common\Http\Exception;
use Prettus\Validator\Exceptions\ValidatorException;

class MarketingController extends CoreController
{
    protected $repository;
    public function __construct(MarketingRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Collection|Marketing[]
     */
    public function index(Request $request)
    {
        $limit = $request->limit ?: 15;
        return $this->repository->paginate($limit);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     * @throws MarvelException
     */
    public function store(Request $request)
    {
        try {
            return $this->repository->createMarketing($request);
        } catch (Exception $ex) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return Response
     * @throws MarvelException
     */
    public function show($id)
    {
        try {
           return $this->repository->findOrFail($id);
        } catch (Exception $ex) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }


    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return Model
     * @throws MarvelException
     */
    public function update(Request $request)
    {
        try {
            $response=new Collection();
            $images=$request->marketing_images;
            foreach ($images as $image){
                $req=new Request();
                $req->merge($image);
                if(is_null($req->id)) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
             $response->add($this->repository->updateMarketing($req,$this->repository->findOrFail($req->id)));
            }
            return $response;
        } catch (Exception $ex) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return void
     */
    public function destroy($id)
    {
        try{
          $target= $this->repository->findOrFail($id);
          $target->delete();
        }catch (\Exception $ex){
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }
}
