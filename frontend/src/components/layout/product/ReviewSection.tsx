"use client";

import { useGetReviewsQuery } from "@/redux/api/productApi";
import RatingSummary from "./RatingSummary";
import RatingBreakdown from "./RatingBreakdown";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

type Props = {
  productId: string;
};

export default function ReviewSection({ productId }: Props) {
  const { data, isLoading } = useGetReviewsQuery(productId);

  if (isLoading) return <p>Loading reviews...</p>;

  const reviews = data?.reviews || [];

  return (
    <div className="review-section">

      <div className="review-top">
        <RatingSummary
          rating={data.ratings}
          totalReviews={data.totalReviews}
        />

        <RatingBreakdown reviews={reviews} />
      </div>

      <ReviewForm productId={productId} />

      <ReviewList reviews={reviews} />

    </div>
  );
}