<?php


namespace Marvel\Http\Controllers;

use Illuminate\Http\Request;
use Marvel\Database\Repositories\CountriesRepository;

class CountryController extends CoreController
{
    private $repository;
    public function __construct(CountriesRepository $repository){
        $this->repository=$repository;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = $request->limit ?: 15;
        if($request->locale_desc) return $this->repository->select("id",$request->locale_desc)->paginate($limit);

        return $this->repository->paginate($limit);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request,$id)
    {
        if($request->locale_desc) return $this->repository->select("id",$request->locale_desc)->where('id',$id)->firstOrFail();
        return $this->repository->findOrFail($id);
    }

}
