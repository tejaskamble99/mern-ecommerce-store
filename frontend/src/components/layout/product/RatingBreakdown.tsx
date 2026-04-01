import { ReviewType } from "./ReviewCard";

type Props = {
  reviews: ReviewType[];
};

export default function RatingBreakdown({ reviews }: Props) {
  
  const counts = [0, 0, 0, 0, 0];
  const total = reviews?.length || 0;

  if (total > 0) {
    reviews.forEach((r) => {
      
      const safeRating = Math.max(1, Math.min(5, Math.round(r.rating || 1)));
      counts[safeRating - 1]++;
    });
  }

  return (
    <div className="rating-breakdown">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = counts[star - 1];
        const percent = total > 0 ? (count / total) * 100 : 0;

        return (
          <div key={star} className="bar-row">
            <span>{star} ★</span>

            <div className="bar" style={{ flex: 1, backgroundColor: "#eee", margin: "0 10px", borderRadius: "4px", overflow: "hidden" }}>
              <div
                className="fill"
                style={{ 
                  width: `${percent}%`, 
                  backgroundColor: "#f59e0b", 
                  height: "10px",
                  transition: "width 0.3s ease-in-out" 
                }}
              />
            </div>

            <span style={{ minWidth: "20px", textAlign: "right" }}>{count}</span>
          </div>
        );
      })}
    </div>
  );
}