<?php

namespace Marvel\Database\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Marvel\Database\Models\ApprovalTokens;
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
        try {
            if(!array_key_exists("id",$request->legal_representative)){
                $legal_representative = LegalRepresentative::create([
                    'name' => $request->legal_representative['name'],
                    'phone' => $request->legal_representative['phone'],
                    'dni_document_id' => $request->legal_representative['dni_document']["id"]
                ]);
                $legal_representative=$legal_representative->id;
            }else{
                $legal_representative=$request->legal_representative["id"];
            }

            $data = $request->only($this->dataArray);
            $data['legal_representative_id'] = $legal_representative;
            $data['dni_document_id'] = $request->dni_document['id'];


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
          $company->update($data);
          DB::commit();

          return $company;
      }catch (ValidationException $e){
          DB::rollBack();
          throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
      }
    }

    public function approveCompany($request,$company){
        $approvalToken=ApprovalTokens::where('token',$request->token)->first();
        if($approvalToken){
            $company->isApproved=true;
            $company->approval_token_id=$approvalToken->id;
            $company->save();
            return $company;
        }
        return $company;

    }
    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }
}
