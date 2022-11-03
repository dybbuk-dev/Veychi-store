<?php


namespace Marvel\Http\Controllers;

use Exception;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Marvel\Database\Models\Balance;
use Marvel\Database\Models\Shop;
use Marvel\Database\Models\User;
use Marvel\Database\Models\Withdraw;
use Marvel\Database\Repositories\WithdrawRepository;
use Marvel\Enums\Permission;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\UpdateWithdrawRequest;
use Marvel\Http\Requests\WithdrawRequest;
use Prettus\Validator\Exceptions\ValidatorException;


class WithdrawController extends CoreController
{
    public $repository;

    public function __construct(WithdrawRepository $repository)
    {
        $this->repository = $repository;
    }
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Collection|Withdraw[]
     */
    public function index(Request $request)
    {
        $limit = $request->limit ?   $request->limit : 15;
        $withdraw = $this->fetchWithdraws($request);
        return $withdraw->paginate($limit);
    }

    public function fetchWithdraws(Request $request)
    {
        $user = $request->user();
        $shop_id = isset($request['shop_id']) ? $request['shop_id'] : false;
        if ($shop_id) {
            if ($user->shops->contains('id', $shop_id)) {
                return $this->repository->with(['shop'])->where('shop_id', '=', $shop_id);
            } elseif ($user && ($user->hasPermissionTo(Permission::SUPER_ADMIN)||
                    $user->hasPermissionTo(Permission::CEO)||
                    $user->hasPermissionTo(Permission::MANAGEMENT)||
                    $user->hasPermissionTo(Permission::LEGAL)||
                    $user->hasPermissionTo(Permission::MANAGER_RH)||
                    $user->hasPermissionTo(Permission::SHAREHOLDER)||
                    $user->hasPermissionTo(Permission::MARKETING))) {
                return $this->repository->with(['shop'])->where('amount', '!=', null);
            } else {
                throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
            }
        } else {
            if ($user && ($user->hasPermissionTo(Permission::SUPER_ADMIN)||
                    $user->hasPermissionTo(Permission::CEO)||
                    $user->hasPermissionTo(Permission::MANAGEMENT)||
                    $user->hasPermissionTo(Permission::LEGAL)||
                    $user->hasPermissionTo(Permission::MANAGER_RH)||
                    $user->hasPermissionTo(Permission::SHAREHOLDER)||
                    $user->hasPermissionTo(Permission::MARKETING))) {
                return $this->repository->with(['shop'])->where('id', '!=', null);
            } else {
                throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
            }
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param WithdrawRequest $request
     * @return mixed
     * @throws ValidatorException
     */
    public function store(WithdrawRequest $request)
    {
        $validatedData = $request->validated();
        if (isset($validatedData['shop_id'])) {
            $balance = Balance::where('shop_id', '=', $validatedData['shop_id'])->first();
            if (isset($balance->current_balance) && $balance->current_balance >= $validatedData['amount']) {
                $withdraw = $this->repository->create($validatedData);
                $balance->withdrawn_amount = $balance->withdrawn_amount + $validatedData['amount'];
                $balance->current_balance = $balance->current_balance - $validatedData['amount'];
                $balance->save();
                $withdraw->shop = $withdraw->shop;
                return $withdraw;
            } else {
                throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.INSUFFICIENT_BALANCE');
            }
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.WITHDRAW_MUST_BE_ATTACHED_TO_SHOP');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, $id)
    {
        $request->id = $id;
        return $this->fetchSingleWithdraw($request);
    }

    public function fetchSingleWithdraw(Request $request)
    {
        $id = $request->id;
        try {
            $withdraw = $this->repository->with(['shop'])->findOrFail($id);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
        if ($request->user() && (($request->user()->hasPermissionTo(Permission::SUPER_ADMIN)||
                    $request->user()->hasPermissionTo(Permission::CEO)||
                    $request->user()->hasPermissionTo(Permission::MANAGEMENT)||
                    $request->user()->hasPermissionTo(Permission::LEGAL)||
                    $request->user()->hasPermissionTo(Permission::MANAGER_RH)||
                    $request->user()->hasPermissionTo(Permission::SHAREHOLDER)||
                    $request->user()->hasPermissionTo(Permission::MARKETING)) || $request->user()->shops->contains('id', $withdraw->shop_id))) {
            return $withdraw;
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param WithdrawRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateWithdrawRequest $request, $id)
    {
        throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.ACTION_NOT_VALID');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        if ($request->user() && $request->user()->hasPermissionTo(Permission::SUPER_ADMIN)||
            $request->user()->hasPermissionTo(Permission::CEO)||
            $request->user()->hasPermissionTo(Permission::MANAGEMENT)||
            $request->user()->hasPermissionTo(Permission::LEGAL)||
            $request->user()->hasPermissionTo(Permission::MANAGER_RH)||
            $request->user()->hasPermissionTo(Permission::SHAREHOLDER)||
            $request->user()->hasPermissionTo(Permission::MARKETING)) {
            try {
                return $this->repository->findOrFail($id)->delete();
            } catch (\Exception $e) {
                throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
            }
        } else {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');
        }
    }

    public function approveWithdraw(Request $request)
    {
        $id = $request->id;
        $status = $request->status->value ?? $request->status;
        try {
            $withdraw = $this->repository->findOrFail($id);
        } catch (Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }

        $withdraw->status = $status;

        $withdraw->save();

        return $withdraw;
    }

    /**
     * @throws MarvelException
     */
    public function exportWithdraws(Request $request){
        try{
            $fields=[
                "Nombre",
            "Monto",
            "Estado",
            "Método de Pago",
            "Detalles",
            "Nota",
            "Fecha del pedido",
            "Nombre del titular de la cuenta",
            'Tipo de cuenta',
            "Email",
            "Nombre del Banco",
            "Número de Cuenta",
            "IBAN",
            "SWIFT"
        ];
            $collection_data=new Collection();
            $raw_data= DB::select("SELECT
        shops.`name`,
        withdraws.amount->> '$.amount'  AS amount,
        withdraws.status->> '$.status'  AS withdrawStatus,
        withdraws.payment_method->> '$.payment_method'  AS payment_method,
        withdraws.details->> '$.details'  AS details,
        withdraws.note->> '$.note'  AS note,
        withdraws.created_at->> '$.created_at'  AS created_at,
   	balances.payment_info->> '$.name'  AS paymentName,
	balances.payment_info->> '$.accountType'  AS accountType,
   	balances.payment_info->> '$.email'  AS email,
	balances.payment_info->> '$.bank'  AS bank,
	balances.payment_info->> '$.account'  AS account,
	balances.payment_info->> '$.iban'  AS iban,
	balances.payment_info->> '$.swift'  AS swift,
    FROM
        shops
        INNER JOIN withdraws ON shops.id = withdraws.shop_id
        INNER JOIN balances ON shops.id = balances.shop_id");
            foreach ($raw_data as $raw_datum) $collection_data->add(new Collection($raw_datum));
            $this->repository->arrayToCsv($collection_data,null,$fields);
        }catch (Exception $ex){
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }

    }
}
