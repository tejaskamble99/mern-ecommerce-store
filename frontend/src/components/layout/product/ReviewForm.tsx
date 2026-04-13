"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAddReviewMutation } from "@/redux/api/productApi";
import Image from "next/image";

type Props = {
  productId: string;
};

export default function ReviewForm({ productId }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const [addReview, { isLoading }] = useAddReviewMutation();

  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);

    
    setImages((prev) => {
      if (prev.length + newFiles.length > 3) {
        toast.error("You can only upload up to 3 photos per review");
        return prev; 
      }
      return [...prev, ...newFiles];
    });

    
    e.target.value = "";
  };

  
  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) return toast.error("Please select rating");
    if (!comment) return toast.error("Please write review");

    try {
      const formData = new FormData();

      formData.append("rating", rating.toString());
      formData.append("comment", comment);
      formData.append("productId", productId);

    
      images.forEach((file) => {
        formData.append("photos", file);
      });

      const res = await addReview(formData).unwrap();

      toast.success(res.message);

      setRating(0);
      setComment("");
      setImages([]);
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };

  return (
    <form className="review-form" onSubmit={submitHandler}>
      <h3>Write a Review</h3>

      {/* Rating */}
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{
              cursor: "pointer",
              color: star <= rating ? "#f59e0b" : "#d1d5db",
              fontSize: "24px",
            }}
          >
            ★
          </span>
        ))}
      </div>

      {/* Comment */}
      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />

      {/* Images */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={imageHandler}
      />

      {/* Preview Images */}
      <div className="review-preview" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
        {images.map((img, index) => (
          <div key={index} style={{ position: "relative" }}>
            <Image
              src={URL.createObjectURL(img)}
              alt="preview"
              width={80}
              height={80}
              style={{ objectFit: "cover", borderRadius: "8px" }}
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                cursor: "pointer",
                fontSize: "10px",
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}