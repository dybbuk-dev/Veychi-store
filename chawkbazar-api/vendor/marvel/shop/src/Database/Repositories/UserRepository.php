<?php

namespace Marvel\Database\Repositories;

use Carbon\Carbon;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Marvel\Database\Models\PremiumPlans;
use Marvel\Database\Models\PremiumSubscriptions;
use Marvel\Database\Models\Settings;
use Marvel\Database\Models\User;
use Prettus\Validator\Exceptions\ValidatorException;
use Marvel\Enums\Permission as UserPermission;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;
use Marvel\Mail\ForgetPassword;
use Illuminate\Support\Facades\Mail;
use Marvel\Database\Models\Address;
use Marvel\Database\Models\Profile;
use Marvel\Database\Models\Shop;
use Marvel\Exceptions\MarvelException;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class UserRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name' => 'like',
        'email' => 'like',
    ];

    /**
     * @var array
     */
    protected $dataArray = [
        'name',
        'email',
        'shop_id',
        'salary',
        'contract'
    ];

    /**
     * Configure the Model
     **/
    public function model()
    {
        return User::class;
    }

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }

    public function storeUser($request)
    {
        try {
            $user = $this->create([
                'name'     => $request->name,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
            ]);
            $user->givePermissionTo(UserPermission::CUSTOMER);
            if (isset($request['address']) && count($request['address'])) {
                $user->address()->createMany($request['address']);
            }
            if (isset($request['profile'])) {
                $user->profile()->create($request['profile']);
            }
            $user->profile = $user->profile;
            $user->address = $user->address;
            $user->shop = $user->shop;
            $user->managed_shop = $user->managed_shop;
            return $user;
        } catch (ValidatorException $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }

    public function updateUser($request, $user)
    {

        try {
            if (isset($request['address']) && count($request['address'])) {
                foreach ($request['address'] as $address) {
                    if (isset($address['id'])) {
                        Address::findOrFail($address['id'])->update($address);
                    } else {
                        $address['customer_id'] = $user->id;
                        Address::create($address);
                    }
                }
            }
            if (isset($request['profile'])) {
                if (isset($request['profile']['id'])) {
                    Profile::findOrFail($request['profile']['id'])->update($request['profile']);
                } else {
                    $profile = $request['profile'];
                    $profile['customer_id'] = $user->id;
                    Profile::create($profile);
                }
            }

 $user->permissions()->sync([]);

            $permissions =$request->permission;
            switch ($permissions) {
                case 'super_admin':
                    $user->givePermissionTo(UserPermission::SUPER_ADMIN);
                    break;
                case 'CEO':
                    # code...
                    $user->givePermissionTo(UserPermission::CEO);
                    break;
                case 'staff':
                    # code...
                    $user->givePermissionTo(UserPermission::CEO);
                    break;
                case 'management':
                    # code...
                    $user->givePermissionTo(UserPermission::MANAGEMENT);
                    break;
                case 'legal':
                    # code...
                     $user->givePermissionTo(UserPermission::LEGAL);
                    break;
                case 'manager_rh':
                    # code...
                     $user->givePermissionTo(UserPermission::MANAGER_RH);
                    break;
                case 'shareholder':
                    # code...
                    $user->givePermissionTo(UserPermission::SHAREHOLDER);
                    break;
                case 'marketing':
                    # code...
                    $user->givePermissionTo(UserPermission::SUPER_ADMIN);
                    break;

                default:
                $user->givePermissionTo(UserPermission::CUSTOMER);
                    break;
            }

            $user->update($request->only($this->dataArray));
            $user->profile = $user->profile;
            $user->address = $user->address;
            $user->shop = $user->shop;
            $user->managed_shop = $user->managed_shop;
            return $user;
        } catch (ValidationException $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }
    }

    public function sendResetEmail($email, $token)
    {
        try {
            Mail::to($email)->send(new ForgetPassword($token));
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * @throws MarvelException
     */

    public function makePremium($shop,$plan_id){
        $shop->premium=true;
        $shop->premium_plan_id=$plan_id;
        $shop->save();
        $premium=new PremiumSubscriptions();
        $plan = PremiumPlans::findOrFail($plan_id);
        $premium->shop_id=$shop->id;
        $premium->plan_id=$plan->id;
        $premium->created_at=Carbon::now();
        $premium->updated_at=Carbon::now();
        $premium->end_date = Carbon::now()->addDays($plan->duration);
        $premium->save();
        return Shop::with(['owner','plan'])->where('id',$shop->id)->first();
    }

    /**
     * @throws MarvelException
     */
    public function premiumSubscription($request): array
    {
        $stripeKey = env('STRIPE_API_KEY');
        if(!isset($stripeKey)) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        Stripe::setApiKey($stripeKey);
        $settings=Settings::first()->options;
        $plan=PremiumPlans::findOrFail($request->id);
        if (!$request->user()->hasPermissionTo(UserPermission::STORE_OWNER)) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_AUTHORIZED');

        $request['tracking_number'] = Str::random(12);
        $request['customer_id'] = $request->user()->id;
        try{
            $paymentIntent=PaymentIntent::create([
                'amount'=>$plan->price*100,
                'currency'=>Str::lower($settings["currency"]),
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);
            return ['clientSecret'=>$paymentIntent->client_secret,'amount'=>$plan->price, 'currency'=>$settings["currency"]];
        }catch (\Exception $ex){

            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.'.$ex->getMessage());
        }


    }



}
