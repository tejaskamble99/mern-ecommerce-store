import ReviewCard, { ReviewType } from "./ReviewCard";

interface ReviewListProps {
  reviews: ReviewType[];
}


export default function ReviewList({ reviews }: ReviewListProps) {
  
  if (!reviews || reviews.length === 0) return <p>No reviews yet.</p>;

  return (
    <div className="review-list">
     
      {reviews.map((r) => (
        <ReviewCard key={r._id} review={r} />
      ))}
    </div>
  );
}