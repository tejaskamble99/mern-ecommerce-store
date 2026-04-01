import Image from "next/image";

// 1. Define the exact shape of your Review data
export interface ReviewImage {
  url: string;
  _id?: string;
}

export interface ReviewType {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  images?: ReviewImage[];
  createdAt?: string; 
}


export default function ReviewCard({ review }: { review: ReviewType }) {
  return (
    <div className="review-card">
      <h4>{review.name}</h4>

      <div className="stars">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{ color: i <= review.rating ? "#f59e0b" : "#ddd" }}
          >
            ★
          </span>
        ))}
      </div>

      <p>{review.comment}</p>

      {review.images && review.images.length > 0 && (
        <div className="review-images">
          {review.images.map((img, i) => {
            
            const imgSrc = img.url.startsWith("http")
              ? img.url
              : `${process.env.NEXT_PUBLIC_SERVER_URL}/${img.url}`;

            return (
              <Image
                key={img._id || i} 
                src={imgSrc}
                alt={`Review image by ${review.name}`}
                width={80}
                height={80}
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
            );
          })}
        </div>
      )}

      
      {review.createdAt && (
        <small>
          {new Date(review.createdAt).toLocaleDateString("en-IN")}
        </small>
      )}
    </div>
  );
}