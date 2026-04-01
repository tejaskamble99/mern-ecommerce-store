"use client";

type Props = {
  rating: number;
  totalReviews: number;
};

export default function RatingSummary({ rating, totalReviews }: Props) {
  return (
    <div className="rating-summary">
      <h2>{rating.toFixed(1)} ★</h2>
      <p>{totalReviews} ratings</p>

      <div className="stars">
        {[1,2,3,4,5].map((i) => (
          <span key={i} style={{color: i <= rating ? "#f59e0b" : "#ddd"}}>
            ★
          </span>
        ))}
      </div>
    </div>
  );
}