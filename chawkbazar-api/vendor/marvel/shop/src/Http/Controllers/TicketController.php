<?php

namespace Marvel\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Marvel\Database\Repositories\TicketCommentsRepository;
use Marvel\Database\Repositories\TicketRepository;
use Marvel\Enums\Permission;
use Marvel\Exceptions\MarvelException;
use Omnipay\Common\Http\Exception;

class TicketController extends CoreController
{
    private $repository;
   public function __construct(TicketRepository $repository){
       $this->repository=$repository;
   }
    public function index(Request $request)
    {
        $limit = $request->limit?:15;

        if($request->user()->hasPermissionTo(Permission::STAFF)) return $this->repository
            ->where('shop_id',$request->user()->shop_id)->with(['comments','shop'])->paginate($limit);

        if($request->user()->hasPermissionTo(Permission::CUSTOMER)) return  $this->repository
            ->where('author_id',$request->user()->id)->with(['comments','shop'])->paginate($limit);

    }


    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return Response
     * @throws MarvelException
     */
    public function store(Request $request)
    {
       return $this->repository->createTicket($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show(Request $request,$id)
    {
        try{
            return $this->repository->getTicket($id, $request)->first();
        }catch (Exception $ex){
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }


    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param int $id
     * @return Response|null
     * @throws MarvelException
     */
    public function update(Request $request, $id)
    {
        try{

            $ticket= $this->repository->getTicket($id, $request)->firstOrFail();
            return $this->repository->updateTicket($request,$ticket);
        }catch (Exception $exception){
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return Response
     * @throws MarvelException
     */
    public function destroy(Request $request,$id)
    {
        try{
            $ticket= $this->repository->getTicket($id, $request)->firstOrFail();
            $ticket->delete();
        }catch (Exception $ex){
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }

    }

    /**
     * @param int $id
     * @param Request $request
     */

}
