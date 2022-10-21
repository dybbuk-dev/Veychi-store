<?php

namespace Marvel\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Marvel\Database\Repositories\PremiumPlansRepository;
use Marvel\Exceptions\MarvelException;

class PremiumPlansController extends Controller
{


    private $repository;
    public function __construct(PremiumPlansRepository $repository){
        $this->repository=$repository;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = $request->limit?:15;
        return $this->repository->paginate($limit);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     * @throws MarvelException
     */
    public function store(Request $request)
    {
      return  $this->repository->storePlan($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
       return $this->repository->find($id);
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
        $request->merge(["id"=>$id]);
       return $this->repository->updatePlan($request);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $this->repository->delete($id);
    }
}
