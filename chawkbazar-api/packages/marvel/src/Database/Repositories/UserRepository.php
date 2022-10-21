<?php

namespace Marvel\Database\Repositories;

use Carbon\Carbon;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Marvel\Database\Models\PremiumPlans;
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
            if(isset($request->contract)){
              $request["contract"]=$this
                    ->base64ImageResolver($request->contract,Str::slug(Carbon::now()."-".$request->name."-contract"));
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

    public function makePremium($shop){
        $shop->premium=true;
        $shop->save();
        return $shop;
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
                'amount'=>$plan->price,
                'currency'=>$settings["currency"],
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);
            return ['clientSecret'=>$paymentIntent->client_secret,'amount'=>$plan->price, 'currency'=>$settings["currency"]];
        }catch (\Exception $ex){
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.PAYMENT_FAILED');
        }


    }



}
