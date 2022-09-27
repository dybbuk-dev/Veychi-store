<?php

namespace Marvel\Http\Controllers;

use Exception;
use http\Client\Response;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Marvel\Database\Repositories\DNIDocumentRepository;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\DNIDocumentCreateRequest;

class DNIDocumentController extends CoreController
{
    public $repository;

    public function __construct(DNIDocumentRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return Model
     */
    public function index(Request $request)
    {
        $limit = $request->limit ?: 15;
        return $this->repository->with([ 'legal_representative', 'company'])->paginate($limit);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param DNIDocumentCreateRequest $request
     * @return Response
     */
    public function store(DNIDocumentCreateRequest $request)
    {
        return $this->repository->save($request);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return DNIDocumentCreateRequest
     * @throws MarvelException
     */
    public function show(int $id)
    {
        try {
            return $this->repository->with(['legal_representative', 'company'])->findOrFail($id);
        }
        catch (Exception $ex) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');

        }
    }


    /**
     * Update the specified resource in storage.
     *
     * @param DNIDocumentCreateRequest $request
     * @param int $id
     * @return array
     */
    public function update(DNIDocumentCreateRequest $request,$id)
    {
        //todo: permission to realize action?
        $dni=$this->repository->findOrFail($id);
        return $this->repository->updateDni($request,$dni);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     */
    public function destroy(int $id)
    {
        try {
            $dni=$this->repository->findOrFail($id);
            if(Storage::exists('public/'.$dni->DNI_document_path))Storage::delete('public/'.$dni->DNI_document_path);
            return $dni->delete();
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }
}
