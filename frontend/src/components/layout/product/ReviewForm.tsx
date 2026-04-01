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

    const files = Array.from(e.target.files);
    setImages(files);
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
        formData.append("images", file);
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
      <div className="review-preview">
        {images.map((img, index) => (
          <Image
          key={index}
            src={URL.createObjectURL(img)}
            alt="preview"
            width={80}
            height={80}
          />
        ))}
      </div>

      <button disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}