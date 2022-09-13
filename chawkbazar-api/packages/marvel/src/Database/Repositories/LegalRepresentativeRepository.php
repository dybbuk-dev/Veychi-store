<?php

namespace Marvel\Database\Repositories;

use Illuminate\Http\Request;
use Marvel\Database\Models\LegalRepresentative;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Prettus\Validator\Exceptions\ValidatorException;

class LegalRepresentativeRepository extends BaseRepository
{
    public $dataArray=[
        'name',
        'phone',
        'dni_document_id'
    ];
    protected $fieldSearchable = [
        'name' => 'like',
        'phone' => 'like',
        'dni_document_id' => '=',
    ];

    public function createLegalRepresentative(Request $request)
    {
        $data=$request->only($this->dataArray);
        return parent::create($data);
    }

    /**
     * @throws ValidatorException
     */
    public function updateLegalRepresentative(Request $request, $dni)
    {
        $data=$request->only($this->dataArray);
        $dni->update($data);
        return $dni;
    }


    public function model()
    {
        return LegalRepresentative::class;
    }
    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }
}
