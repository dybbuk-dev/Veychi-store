<?php

namespace Marvel\Database\Repositories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Marvel\Database\Models\Company;
use Marvel\Database\Models\DniDocument;
use Marvel\Database\Models\LegalRepresentative;
use Marvel\Exceptions\MarvelException;
use Nette\Schema\ValidationException;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Prettus\Validator\Exceptions\ValidatorException;

class CompanyRepository extends BaseRepository
{

    protected $fieldSearchable = [
        'name' => 'like',
        'line_of_business' => 'like',
        'tax_country' => 'like',
    ];
    protected $dataArray = [
        'name',
        'line_of_business',
        'physical_address',
        'fiscal_address',
        'tax_country',
        'business_phone',
        'products_description',
        'user_id'
    ];

    public function model(): string
    {
        return Company::class;
    }

    /**
     * @throws MarvelException
     */
    public function saveCompany($request)
    {
        $data = $request->only($this->dataArray);
        try {
            if(!array_key_exists("id",$request->dni_document)){
                $dni_document_path = Storage::put("public/".Str::slug(Carbon::now())."-".$request->dni_document["DNI"]."jpg",base64_decode($request->dni_document["DNI_image"]));
                   $document= DniDocument::create([
                        'DNI'=>$request->dni_document["DNI"],
                        'DNI_document_path'=>$dni_document_path
                    ]);
                $data['dni_document_id'] =$document->id;
            }
            else{
                $data['dni_document_id'] = $request->dni_document['id'];
            }
            if(!array_key_exists("id",$request->legal_representative)){
               $dni_legal_representative = $request->legal_representative["dni_document"];
               $dni_legal_representative["DNI_document_path"] =  Storage::put("public/".Str::slug(Carbon::now())."-".$dni_legal_representative["DNI"]."jpg",base64_decode($dni_legal_representative["DNI_image"]));
               $dni_document = DniDocument::create([
                  'DNI'=>  $dni_legal_representative["DNI"],
                   "DNI_document_path"=> $dni_legal_representative["DNI_document_path"]
               ]);

               // $request->legal_representative['dni_document']["id"]
                $legal_representative = LegalRepresentative::create([
                    'name' => $request->legal_representative['name'],
                    'phone' => $request->legal_representative['phone'],
                    'dni_document_id' =>$dni_document->id
                ]);
                $legal_representative=$legal_representative->id;
            }else{
                $legal_representative=$request->legal_representative["id"];
            }


            $data['legal_representative_id'] = $legal_representative;



            $company= $this->create($data);

            DB::commit();
            return $this->with(['legal_representative'=>function($q){
                return $q->with('dni_document');
            },'dni_document'])->find($company->id);

        } catch (ValidatorException $e) {
            DB::rollBack();
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }

    /**
     * @param $request
     * @param $company
     * @return Model
     * @throws MarvelException
     */
    public function updateCompany($request, $company)
    {
      try{
          DB::beginTransaction();
          $data=$request->only($this->dataArray);
          $data['user_id']=Auth::id();
          $company->update($data);
          DB::commit();

          return $company;
      }catch (ValidationException $e){
          DB::rollBack();
          throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
      }
    }


    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }
}
