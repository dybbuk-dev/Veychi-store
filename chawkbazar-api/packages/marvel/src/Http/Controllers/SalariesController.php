<?php

namespace Marvel\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Marvel\Database\Repositories\SalariesRepository;
use Marvel\Exceptions\MarvelException;
use Omnipay\Common\Http\Exception;

class SalariesController extends Controller
{
    private $repository;
    public function __construct(SalariesRepository $repository){
        $this->repository =$repository;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit=$request->limit?:15;
        return $this->repository->with('user')->paginate($limit);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
       return $this->repository->createSalaries($request);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     * @throws MarvelException
     */
    public function show($id)
    {
        try{
           return $this->repository->with('user')->find($id);
        }catch(Exception $exception){
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }

    }


    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     * @throws MarvelException
     */
    public function update(Request $request, $id)
    {
        try{
            $salary=$this->repository->find($id);
            return $this->repository->updateSalary($salary,$request);
        }catch (Exception $ex){
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SOMETHING_WENT_WRONG');
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->repository->deleteSalary($id);
    }
}
