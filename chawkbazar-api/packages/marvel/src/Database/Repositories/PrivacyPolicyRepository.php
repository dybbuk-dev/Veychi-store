<?php

namespace Marvel\Database\Repositories;

use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Marvel\Database\Models\PrivacyPolicy;

use Marvel\Enums\ticketPriority;
use Marvel\Enums\ticketStatus;
use Marvel\Exceptions\MarvelException;
use Prettus\Repository\Criteria\RequestCriteria;



/**
 * Class TicketRepository.
 *
 * @package namespace App\Repositories;
 */
class PrivacyPolicyRepository extends BaseRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    protected $dataArray=[
        'pdf',
        'text',
    ];

    private function validationFieldsCreate():array{
        return  [
            'pdf'=>'required',
            'text'=>'required|max:2500',
        ];
    }
    private function validationFieldsUpdate():array{
        return  [
            'pdf'=>'nullable',
            'text'=>'nullable|max:2500',
        ];
    }
    public function model()
    {
        return PrivacyPolicy::class;
    }

    /**
     * @throws MarvelException
     */
    public function addPrivacyPolicy($request)
    {
        $validator=Validator::make($request->all(),$this->validationFieldsCreate());
        if($validator->fails()) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        $this->deletePolicy();
        $request["pdf"]=$this->base64ImageResolver($request->pdf,Str::slug('Privacy policy '.Carbon::now()));
        return PrivacyPolicy::create($request->only($this->dataArray));
    }

    /**
     * @throws MarvelException
     */
    public function updatePrivacyPolicy($request){
        $validator=Validator::make($request->all(),$this->validationFieldsUpdate());
        if($validator->fails()) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        $policy=$this->first();
        $policy->pdf=$this->base64ImageResolver($request->pdf,Str::slug('Privacy policy '.Carbon::now()));
        $policy->text=$request->text;
        $policy->save();
        return $policy;
    }


    public function deletePolicy()
    {
        PrivacyPolicy::whereNull('deleted_at')->update(['deleted_at'=>Carbon::now()]);
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }


}
