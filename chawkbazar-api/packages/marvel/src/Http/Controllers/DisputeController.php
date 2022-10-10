<?php

namespace Marvel\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Marvel\Database\Models\Order;
use Marvel\Database\Repositories\DisputeRepository;
use Marvel\Enums\Permission;

class DisputeController extends Controller
{


    private $repository;
    public function __construct(DisputeRepository $repository){
        $this->repository=$repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit=$request->limit?:15;
     return $this->repository->getDisputes($limit,$request);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
       return $this->repository->with('messages')->findOrFail($id);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request,$id)
    {
        $request->merge(['purchase_id'=>$id]);
        return $this->repository->createDispute($request);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->merge(['purchase_id'=>$id]);
        return $this->repository->updateDispute($request);
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

    public function storeMessage(Request $request){
        return $this->repository->addMessage($request);
    }

    public function destroyMessage($id){
        $this->repository->deleteMessage($id);
    }
}
