<?php

namespace Marvel\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Marvel\Database\Repositories\PremiumSubscriptionsRepository;
use Marvel\Exceptions\MarvelException;

class PremiumSubscriptionsController extends Controller
{
    private $repository;
    public function __construct(PremiumSubscriptionsRepository $repository){
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     * @throws MarvelException
     */
    public function index(Request $request)
    {
        return $this->repository->indexPremiumSubscriptions($request);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     * @throws MarvelException
     */
    public function show(Request $request,$id)
    {
       return $this->repository->showPremiumSubscription($request,$id);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
   /* public function store(Request $request)
    {
        return $this->repository->storeSubscription($request);
    }*/

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, int $id)
    {
        $request->merge(['id'=>$id]);

     return  $this->repository->updateSubscription($request);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     * @throws MarvelException
     */
    public function destroy(Request $request, $id)
    {
        $this->repository->cancelPremium($request,$id);
    }
}
