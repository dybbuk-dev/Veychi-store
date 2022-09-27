<?php


namespace Marvel\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Marvel\Database\Repositories\CustomerReviewsRepository;
use Marvel\Exceptions\MarvelException;
use Marvel\Http\Requests\CustomerReviewProductRequest;

class CustomerReviewsController extends Controller
{

    private $repository;

    public function __construct(CustomerReviewsRepository $repository){
        $this->repository=$repository;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = $request->limit ?: 10;
        return $this->repository->with('productsHasReview')->limit($limit);

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     * @throws MarvelException
     */
    public function store(CustomerReviewProductRequest $request)
    {
        try {
            return $this->repository->addReview($request);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR');
        }


    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            return $this->repository->with('productsHasReview')->findOrFail($id);
        } catch (\Exception $e) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }

    }


}
