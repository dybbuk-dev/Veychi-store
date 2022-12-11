<?php

namespace Marvel\Http\Controllers;


use Exception;
use http\Client\Response;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Marvel\Database\Repositories\LegalRepresentativeRepository;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\DNIDocumentCreateRequest;
use Marvel\Http\Requests\LegalRepresentativeCreateRequest;
use Marvel\Http\Requests\LegalRepresentativeUpdateRequest;

class LegalRepresentativeController extends CoreController
{
    private $repository;
    public function __construct(LegalRepresentativeRepository $repository)
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
        return $this->repository->with( 'dni_document')->paginate($limit);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param LegalRepresentativeCreateRequest $request
     * @return array
     */
    public function store(LegalRepresentativeCreateRequest $request)
    {
        return $this->repository->createLegalRepresentative($request);
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
            return $this->repository->with('dni_document')->findOrFail($id);
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
    public function update(LegalRepresentativeUpdateRequest $request, int $id)
    {
        //todo: permission to realize action?
        $dni=$this->repository->findOrFail($id);
        return $this->repository->updateLegalRepresentative($request,$dni);
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
            return $this->repository->findOrFail($id)->delete();
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
    }
}
