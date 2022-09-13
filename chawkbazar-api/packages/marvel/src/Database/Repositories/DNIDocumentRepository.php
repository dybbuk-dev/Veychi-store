<?php

namespace Marvel\Database\Repositories;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Marvel\Database\Models\Company;
use Marvel\Database\Models\DniDocument;
use Marvel\Exceptions\MarvelException;
use Omnipay\Common\Http\Exception;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class DNIDocumentRepository extends BaseRepository
{
    protected $dataArray = [
        'DNI',
        'DNI_document_path',
    ];

    public function model()
    {
        return DniDocument::class;
    }

    /**
     * @throws MarvelException
     */
    public function save($request){
        $document = $request->file('DNI_document');
        $DNI_document_path = $document->storePubliclyAs('DNI-files', 'attributes-' . Auth::id() . '.' . $document->getClientOriginalExtension(), 'public');
        return DniDocument::create([
            'DNI' => $request->DNI,
            'DNI_document_path' => $DNI_document_path
        ]);
    }

    public function updateDni($request,$dni){

        $document = $request->file('DNI_document');
        if(Storage::exists('public/'.$dni->DNI_document_path))Storage::delete('public/'.$dni->DNI_document_path);
        $DNI_document_path = $document->storePubliclyAs('DNI-files', 'attributes-' . Auth::id() . '.' . $document->getClientOriginalExtension(), 'public');
            $dni->DNI_document_path=$DNI_document_path;
            $dni->DNI=$request->DNI;
            $dni->save();
            return $dni;


    }


    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }
}
