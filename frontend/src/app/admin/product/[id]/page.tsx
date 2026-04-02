"use client";

import { useFileHandler } from "6pp";
import { FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useRouter, useParams, notFound } from "next/navigation";
import { Skeleton } from "@/components/admin/Loader";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteReviewMutation,
} from "@/redux/api/productApi";
import { RootState } from "@/redux/store";
import { responseToast } from "@/utils/features";
import { server } from "@/redux/store";
import Image from "next/image";
import ReviewForm from "@/components/layout/product/ReviewForm";
import { Review } from "@/types/types";

const ProductManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params?.id;

  const { data, isLoading, isError } = useProductDetailsQuery(productId ?? "", {
    skip: !productId,
  });

  const {
    price,
    salePrice,
    photo,
    name,
    stock,
    category,
    description,
    reviews,
  } = data?.product || {
    photo: "",
    category: "",
    name: "",
    stock: 0,
    price: 0,
    salePrice: 0,
    description: "",
    reviews: [],
  };

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [salePriceUpdate, setSalePriceUpdate] = useState<number | "">(
    salePrice || "",
  );
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [descriptionUpdate, setDescriptionUpdate] =
    useState<string>(description);

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const photoFile = useFileHandler("single", 10);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const formData = new FormData();

      if (nameUpdate) formData.set("name", nameUpdate);
      if (descriptionUpdate) formData.set("description", descriptionUpdate);
      if (priceUpdate) formData.set("price", priceUpdate.toString());
      if (salePriceUpdate !== "")
        formData.set("salePrice", salePriceUpdate.toString());
      if (stockUpdate !== undefined)
        formData.set("stock", stockUpdate.toString());
      if (categoryUpdate) formData.set("category", categoryUpdate);

      if (photoFile.file) {
        formData.set("photo", photoFile.file as Blob);
      }

      const res = await updateProduct({
        formData,
        productId: productId ?? "",
      });

      responseToast(res, router, "/admin/product");
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await deleteProduct(productId ?? "");
    responseToast(res, router, "/admin/product");
  };

  const reviewDeleteHandler = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const res = await deleteReview({ productId: productId ?? "", reviewId });
    responseToast(res, router, ""); // Stay on same page, RTK will auto-refresh
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setSalePriceUpdate(data.product.salePrice || "");
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
      setDescriptionUpdate(data.product.description);
    }
  }, [data]);

  if (isLoading) return <Skeleton length={20} />;
  if (isError) return notFound();

  return (
    <main className="product-management">
      {isLoading ? (
        <Skeleton length={20} />
      ) : (
        <>
          <section>
            <strong>ID - {data?.product._id}</strong>
            {photo && (
              <Image
                src={`${server}/${photo}`}
                alt={name}
                width={200}
                height={200}
              />
            )}
            <p>{name}</p>
            {stock > 0 ? (
              <span className="green">{stock} Available</span>
            ) : (
              <span className="red">Not Available</span>
            )}

            {salePrice ? (
              <h3>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#9ca3af",
                    marginRight: "10px",
                    fontSize: "1rem",
                  }}
                >
                  ₹{price.toLocaleString("en-IN")}
                </span>
                ₹{salePrice.toLocaleString("en-IN")}
              </h3>
            ) : (
              <h3>₹{price.toLocaleString("en-IN")}</h3>
            )}
          </section>

          <article>
            <button className="product-delete-btn" onClick={deleteHandler}>
              <FaTrash />
            </button>
            <form onSubmit={submitHandler}>
              <h2>Manage</h2>
              {/* Form fields stay exactly the same */}
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={nameUpdate}
                  onChange={(e) => setNameUpdate(e.target.value)}
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  required
                  placeholder="Description"
                  value={descriptionUpdate}
                  onChange={(e) => setDescriptionUpdate(e.target.value)}
                />
              </div>
              <div>
                <label>Price</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={priceUpdate}
                  onChange={(e) => setPriceUpdate(Number(e.target.value))}
                />
              </div>
              <div>
                <label>Sale Price (Optional)</label>
                <input
                  type="number"
                  placeholder="Leave blank for no sale"
                  value={salePriceUpdate}
                  onChange={(e) =>
                    setSalePriceUpdate(
                      e.target.value ? Number(e.target.value) : "",
                    )
                  }
                />
              </div>
              <div>
                <label>Stock</label>
                <input
                  type="number"
                  placeholder="Stock"
                  value={stockUpdate}
                  onChange={(e) => setStockUpdate(Number(e.target.value))}
                />
              </div>
              <div>
                <label>Category</label>
                <input
                  type="text"
                  placeholder="eg. laptop, camera etc"
                  value={categoryUpdate}
                  onChange={(e) => setCategoryUpdate(e.target.value)}
                />
              </div>
              <div>
                <label>Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={photoFile.changeHandler}
                />
              </div>

              {photoFile.error && <p>{photoFile.error}</p>}

              {photoFile.preview && (
                <Image
                  src={photoFile.preview as string}
                  alt="New Preview"
                  width={100}
                  height={100}
                />
              )}

              <button disabled={btnLoading} type="submit">
                {btnLoading ? "Updating..." : "Update"}
              </button>
            </form>
          </article>
          <div className="admin-review-section">
            <h2>Manage Reviews</h2>

            <div className="review-section-inner">
              {/* Left: Add/Edit Form */}
              <div className="admin-review-card">
                <h3>Add / Edit Review as Admin</h3>
                <ReviewForm productId={productId ?? ""} />
              </div>

              {/* Right: Existing Reviews List */}
              <div className="admin-reviews-list">
                <h3>Existing Reviews ({reviews?.length || 0})</h3>
                {reviews && reviews.length > 0 ? (
                  reviews.map((review: Review) => (
                    <div key={review._id}>
                      <div>
                        <strong>{review.name}</strong>
                        <span>{review.rating} ★</span>
                        <p>{review.comment}</p>
                      </div>
                      <button
                        onClick={() => reviewDeleteHandler(review._id)}
                        title="Delete Review"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No reviews found for this product.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default ProductManagement;
