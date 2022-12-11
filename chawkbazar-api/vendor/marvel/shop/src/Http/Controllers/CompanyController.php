<?php

namespace Marvel\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Marvel\Database\Models\Company;
use Marvel\Database\Repositories\CompanyRepository;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\CompanyCreateRequest;
use Marvel\Http\Requests\CompanyUpdateRequest;
use Omnipay\Common\Http\Exception;
use Marvel\Http\Controllers\CoreController;
use phpDocumentor\Reflection\Types\Boolean;

class CompanyController extends CoreController
{

    private $repository;

    public function __construct(CompanyRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Collection|Response|Company[]
     */
    public function index(Request $request)
    {
        $limit = $request->limit ?: 15;
        return $this->repository->with(['user', 'legal_representative'=>function($q){
            return $q->with('dni_document');
            }, 'dni_document'])->paginate($limit);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CompanyCreateRequest $request
     * @return Response
     */
    public function store(CompanyCreateRequest $request)
    {
        return $this->repository->saveCompany($request);
    }



    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return Model
     * @throws MarvelException
     */
    public function show(int $id):Model
    {
        try {
            return $this->repository->with(['user', 'legal_representative', 'dni_document'])->findOrFail($id);
        }
        catch (Exception $ex) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');

        }
    }


    /**
     * Update the specified resource in storage.
     *
     * @param CompanyUpdateRequest $request
     * @param int $id
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function update(CompanyUpdateRequest $request,$id): Model
    {
    //todo: permission to realize action?
    $company=$this->repository->findOrFail($id);
    return $this->repository->updateCompany($request,$company);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Application|ResponseFactory|Response
     * @throws MarvelException
     */
    public function destroy(int $id)
    {
        try {
             $this->repository->findOrFail($id)->delete();
            return response('Company has been deleted',200);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }
}
