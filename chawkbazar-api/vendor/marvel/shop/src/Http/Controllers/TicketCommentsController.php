<?php

namespace Marvel\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Marvel\Database\Repositories\TicketCommentsRepository;
use Marvel\Exceptions\MarvelException;

class TicketCommentsController extends CoreController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    private $repository;
    public function __construct(TicketCommentsRepository $repository)
    {
        $this->repository=$repository;
    }

    public function index(Request $request)
    {
        $limit = $request->limit ?   : 10;
        $this->repository->paginate($limit);
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
       return $this->repository->saveComment($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        $comment=$this->repository->find($id);
        if(!$comment) throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
       return $this->repository->editComment($comment,$request);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
