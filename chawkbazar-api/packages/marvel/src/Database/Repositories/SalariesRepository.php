<?php

namespace Marvel\Database\Repositories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Marvel\Database\Models\Salaries;
use Marvel\Database\Models\Ticket;
use Marvel\Enums\SalaryStatus;
use Marvel\Enums\ticketPriority;
use Marvel\Enums\ticketStatus;
use Marvel\Exceptions\MarvelException;
use Omnipay\Common\Http\Exception;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Validator\Exceptions\ValidatorException;


/**
 * Class TicketRepository.
 *
 * @package namespace App\Repositories;
 */
class SalariesRepository extends BaseRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    protected $dataArray=[
        'salary',
        'payment_date',
        'user_id',
        'payment_status',

    ];
// throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
    private function validationFields():array{
        return  [
            'salary'=>'required|max:191',
            'payment_date'=>'required|date',
            'user_id'=>'required|exists:Users,id',
            'payment_status'=>['required',Rule::in([SalaryStatus::PAYED,SalaryStatus::PENDING])],
        ];
    }

    /**
     * @throws MarvelException
     */
    public function createSalaries($request){
        $this->validateFields($request);
        return $this->create($request->only($this->dataArray));
    }
    private function validateFields($request){
          $validation=Validator::make($request->all(),$this->validationFields());
        if($validation->fails()) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
    }
    public function updateSalary($targetSalary,$request){
        $this->validateFields($request);
        $targetSalary->salary=$request->salary;
        $targetSalary->payment_date = $request->payment_date;
        $targetSalary->user_id = $request->user_id;
        $targetSalary->payment_status = $request->payment_status;
        $targetSalary->save();
        return $targetSalary;
    }

    public function deleteSalary($id){
        $this->find($id)->delete();
    }

    public function model()
    {
        return Salaries::class;
    }

    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }


}
