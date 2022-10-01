import { Product } from "@framework/types";
import { useState } from "react";
import axios from "axios";
import Rating from "react-rating-stars-component";
import Cookies from "js-cookie";

export default function productReviews({ product }: { product: Product }) {
  const [newReview, setNewReview] = useState({
    comment: "",
    score: 0,
    product_id: product.id,
  });

  const handleNewReview = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (newReview.comment.length < 15) {
      alert("La review es muy corta.");
      return;
    }
    await axios.post(
      (process.env.NEXT_PUBLIC_REST_API_ENDPOINT as string) +
        "/products/review",
      newReview,
      { headers: { Authorization: `Bearer ${Cookies.get("auth_token")}` } }
    );
    window.location.reload();
  };

  const renderStar = (score: number) => {
    const stars = [];
    for (let i = 0; i < score; i++) {
      stars.push(
        <img className="w-5" src="/assets/images/products/star.svg" alt="" />
      );
    }
    return stars;
  };
  return (
    <div>
      <h1 className="text-heading text-lg md:text-xl lg:text-2xl 2xl:text-3xl font-bold hover:text-black mb-3.5">
        Reviews
      </h1>
      {product.customer_reviews && (
        <div>
          {product?.customer_reviews?.length > 0 ? (
            <>
              {product?.customer_reviews?.map((review) => (
                <div className="md:w-2/3 w-10/12 mx-auto p-5 bg-[#CCCCCC] rounded-lg mt-2">
                  <h2 className="text-heading text-md md:text-lg lg:text-xl 2xl:text-xl font-bold hover:text-black mb-3.5">
                    {review.user.name}
                  </h2>
                  <div className="flex">
                    {renderStar(parseInt(review.score))}
                  </div>
                  <p className="text-heading text-md md:text-lg lg:text-xl 2xl:text-xl my-3.5">
                    {review.comment}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <>
              <h1 className="text-body italic text-md md:text-lg lg:text-xl 2xl:text-xl font-bold mb-3.5 text-center">
                No hay reviews.
              </h1>
            </>
          )}
        </div>
      )}
      <div className="md:w-2/3 w-10/12 min-h-[100px] mx-auto p-5 bg-[#CCCCCC] rounded-lg mt-2 mb-5">
        <h1 className="text-heading text-md md:text-lg lg:text-xl 2xl:text-xl font-bold hover:text-black">
          Escriba una review
        </h1>
        {Cookies.get("auth_token") ? (
          <form>
            <Rating
              count={5}
              onChange={(newValue: number) => {
                setNewReview({ ...newReview, score: newValue });
              }}
              size={24}
              activeColor="#F5B700"
            />
            <textarea
              name="comment"
              id="comment"
              className="w-full h-24 p-2 rounded-lg mt-2"
              placeholder="¿Qué opina del producto?"
              onChange={(e) => {
                setNewReview({ ...newReview, comment: e.target.value });
              }}
            ></textarea>
            <button
              onClick={handleNewReview}
              className="rounded-lg mt-2 text-white bg-black p-3 block w-full font-bold"
            >
              Enviar
            </button>
          </form>
        ) : (
          <h1 className="text-body text-md md:text-lg lg:text-xl 2xl:text-xl font-bold my-3.5">
            Debe iniciar sesión para poder escribir una review.
          </h1>
        )}
      </div>
    </div>
  );
}
