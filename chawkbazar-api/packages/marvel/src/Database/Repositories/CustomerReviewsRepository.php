<?php

namespace Marvel\Database\Repositories;


use Illuminate\Support\Facades\Auth;
use Marvel\Database\Models\CustomerReviews;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

/**
 * Class CustomerReviewsRepository.
 *
 * @package namespace Marvel\Database\Repositories;

 */
class CustomerReviewsRepository extends BaseRepository
{

    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }
    public function model()
    {
        return CustomerReviews::class;
    }
    public function addReview($request){
        $review=CustomerReviews::create([
            'comment'=>$request->comment,
            'score'=>$request->score,
            'user_id'=>Auth::id()
        ]);
        $product=$this->findOrFail($request->product_id);
        $product->customerReviews()->attach($review->id);
        $product->save();
        return $this->with('customerReviews')->findOrFail($product->id);
    }

}
