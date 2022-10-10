<?php


namespace Marvel\Database\Repositories;

use Marvel\Database\Models\ApprovalTokens;
use Marvel\Database\Models\Balance;
use Marvel\Database\Models\Shop;
use Marvel\Enums\Permission;
use Marvel\Exceptions\MarvelException;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Prettus\Validator\Exceptions\ValidatorException;

class ShopRepository extends BaseRepository
{

    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name'        => 'like',
        'is_active',
        'categories.slug',
        'country_id'
    ];

    /**
     * @var array
     */
    protected $dataArray = [
        'name',
        'description',
        'cover_image',
        'logo',
        'address',
        'settings',
        'country_id'
    ];


    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }

    /**
     * Configure the Model
     **/
    public function model()
    {
        return Shop::class;
    }

    public function storeShop($request)
    {
        try {

            $data = $request->only($this->dataArray);
            $data['owner_id'] = $request->user()->id;
            $shop = $this->create($data);
            if (isset($request['categories'])) {
                $shop->categories()->attach($request['categories']);
            }
            if (isset($request['balance']['payment_info'])) {
                $shop->balance()->create($request['balance']);
            }
            $shop->categories = $shop->categories;
            $shop->staffs = $shop->staffs;
           // $shop->save();
            return $shop;
        } catch (ValidatorException $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }

    public function updateShop($request, $id)
    {
        try {
            $shop = $this->findOrFail($id);
            if (isset($request['categories'])) {
                $shop->categories()->sync($request['categories']);
            }

            if (isset($request['balance'])) {
                if (isset($request['balance']['admin_commission_rate']) && $shop->balance->admin_commission_rate !== $request['balance']['admin_commission_rate']) {
                    if ( ($request->user()->hasPermissionTo(Permission::SUPER_ADMIN)||
                        $request->user()->hasPermissionTo(Permission::CEO)||
                        $request->user()->hasPermissionTo(Permission::MANAGEMENT)||
                        $request->user()->hasPermissionTo(Permission::LEGAL)||
                        $request->user()->hasPermissionTo(Permission::MANAGER_RH)||
                        $request->user()->hasPermissionTo(Permission::SHAREHOLDER)||
                        $request->user()->hasPermissionTo(Permission::MARKETING))
                    ) {
                        $this->updateBalance($request['balance'], $id);
                    }
                } else {
                    $this->updateBalance($request['balance'], $id);
                }
            }
            $shop->update($request->only($this->dataArray));
            $shop->categories = $shop->categories;
            $shop->staffs = $shop->staffs;
            $shop->balance = $shop->balance;
            return $shop;
        } catch (ValidatorException $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }

    public function updateBalance($balance, $shop_id)
    {
        if (isset($balance['id'])) {
            Balance::findOrFail($balance['id'])->update($balance);
        } else {
            $balance['shop_id'] = $shop_id;
            Balance::create($balance);
        }
    }

    /**
     * @throws Exception
     */
    public function approveShop($request, $shop){
        $approvalToken=ApprovalTokens::where('token',$request->token)->first();
        if($approvalToken){
            $shop->is_active=true;
            $shop->approval_token_id=$approvalToken->id;
            $shop->save();
            return $shop;
        }
        throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');

    }
}
