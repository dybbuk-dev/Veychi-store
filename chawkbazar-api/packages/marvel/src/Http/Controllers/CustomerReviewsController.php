<?php


namespace Marvel\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Marvel\Database\Repositories\CustomerReviewsRepository;
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CustomerReviewProductRequest $request)
    {
        return $this->repository->addReview($request);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        return $this->repository->with('productsHasReview')->findOrFail($id);
    }


}
