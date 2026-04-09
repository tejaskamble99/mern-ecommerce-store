"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useRouter, useParams, notFound } from "next/navigation";
import { Skeleton } from "@/components/admin/Loader";
import {
  useDeleteProductMutation,
  useUpdateProductMutation,
  useDeleteReviewMutation,
  useProductDetailsByIdQuery,
} from "@/redux/api/productApi";
import { RootState } from "@/redux/store";
import { responseToast } from "@/utils/features";
import { server } from "@/redux/store";
import Image from "next/image";
import ReviewForm from "@/components/layout/product/ReviewForm";
import { Review } from "@/types/types";
import RichTextEditor from "@/components/layout/RichTextEditor";

const ProductManagement = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params?.id;

  const { data, isLoading, isError } = useProductDetailsByIdQuery(
    productId ?? "",
    {
      skip: !productId,
    },
  );

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

  const [btnLoading, setBtnLoading] = useState(false);

  const [priceUpdate, setPriceUpdate] = useState(price);
  const [salePriceUpdate, setSalePriceUpdate] = useState<number | "">(
    salePrice || "",
  );
  const [stockUpdate, setStockUpdate] = useState(stock);
  const [nameUpdate, setNameUpdate] = useState(name);
  const [categoryUpdate, setCategoryUpdate] = useState(category);
  const [descriptionUpdate, setDescriptionUpdate] = useState(description);

  /* ---------- MULTIPLE IMAGE STATES ---------- */
  const [photos, setPhotos] = useState<File[]>([]);
  const [photosPrev, setPhotosPrev] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  /* ---------- SEO STATES ---------- */
  const [metaTitleUpdate, setMetaTitleUpdate] = useState("");
  const [metaDescriptionUpdate, setMetaDescriptionUpdate] = useState("");
  const [slugUpdate, setSlugUpdate] = useState("");
  const [keywordsUpdate, setKeywordsUpdate] = useState("");

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [deleteReview] = useDeleteReviewMutation();

  /* ---------- IMAGE HANDLERS ---------- */
  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setPhotos((prev) => [...prev, ...files]);

    const promises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (typeof reader.result === "string") resolve(reader.result);
        };
      });
    });

    Promise.all(promises).then((base64) =>
      setPhotosPrev((prev) => [...prev, ...base64]),
    );

    e.target.value = "";
  };

  const removeNewImage = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotosPrev((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- FORM SUBMISSION ---------- */
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

      formData.set("metaTitle", metaTitleUpdate);
      formData.set("metaDescription", metaDescriptionUpdate);
      formData.set("slug", slugUpdate);
      formData.set("keywords", keywordsUpdate);

      photos.forEach((file) => {
        formData.append("photos", file);
      });

      formData.append("existingImages", JSON.stringify(existingImages));

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
    const res = await deleteReview({
      productId: productId ?? "",
      reviewId,
    });
    responseToast(res, router, "");
  };

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setSalePriceUpdate(data.product.salePrice || "");
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
      setDescriptionUpdate(data.product.description);
      setMetaTitleUpdate(data.product.seo?.metaTitle || "");
      setMetaDescriptionUpdate(data.product.seo?.metaDescription || "");
      setSlugUpdate(data.product.seo?.slug || "");
      setKeywordsUpdate(data.product.seo?.keywords?.join(", ") || "");

      setExistingImages(data.product.photos || []);
    }
  }, [data]);

  if (isLoading) return <Skeleton length={20} />;
  if (isError) return notFound();

  return (
    <main className="product-management">
      <section>
        <strong>ID - {data?.product._id}</strong>

        {existingImages.length > 0 && (
          <Image
            src={`${server}/${existingImages[0]}`}
            alt={name}
            width={200}
            height={200}
            style={{ borderRadius: "8px", objectFit: "cover" }}
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
                marginRight: 10,
                color: "#9ca3af",
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
          {/* ---------- BASIC INFO ---------- */}
          <h2>Manage Product</h2>

          <div>
            <label>Name</label>
            <input
              value={nameUpdate}
              onChange={(e) => setNameUpdate(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Description</label>

            <RichTextEditor
              value={descriptionUpdate}
              onChange={(value) => setDescriptionUpdate(value)}
            
            />
          </div>

          <div>
            <label>Price</label>
            <input
              type="number"
              value={priceUpdate}
              onChange={(e) => setPriceUpdate(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label>Sale Price (Optional)</label>
            <input
              type="number"
              value={salePriceUpdate}
              onChange={(e) =>
                setSalePriceUpdate(e.target.value ? Number(e.target.value) : "")
              }
            />
          </div>

          <div>
            <label>Stock</label>
            <input
              type="number"
              value={stockUpdate}
              onChange={(e) => setStockUpdate(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label>Category</label>
            <input
              value={categoryUpdate}
              onChange={(e) => setCategoryUpdate(e.target.value)}
              required
            />
          </div>

          {/* ---------- SEO SETTINGS ---------- */}
          <h2>SEO Settings</h2>

          <div>
            <label>Custom Slug (URL)</label>
            <input
              type="text"
              placeholder="Leave blank to auto-generate"
              value={slugUpdate}
              onChange={(e) => setSlugUpdate(e.target.value)}
            />
          </div>

          <div>
            <label>Meta Title</label>
            <input
              type="text"
              placeholder="Max 60 chars"
              value={metaTitleUpdate}
              onChange={(e) => setMetaTitleUpdate(e.target.value)}
            />
          </div>

          <div>
            <label>Meta Description</label>
            <textarea
              placeholder="Max 160 chars"
              value={metaDescriptionUpdate}
              onChange={(e) => setMetaDescriptionUpdate(e.target.value)}
            />
          </div>

          <div>
            <label>Keywords</label>
            <input
              type="text"
              placeholder="Comma separated (e.g. laptop, gaming, rgb)"
              value={keywordsUpdate}
              onChange={(e) => setKeywordsUpdate(e.target.value)}
            />
          </div>

          {/* ---------- IMAGES ---------- */}
          <h2>Images</h2>
          <div>
            <label>Upload Gallery</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={changeImageHandler}
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "1rem",
              }}
            >
              {/* Existing Images */}
              {existingImages.map((src, index) => (
                <div key={`existing-${index}`} style={{ position: "relative" }}>
                  <Image
                    src={`${server}/${src}`}
                    alt={`Existing ${index}`}
                    width={80}
                    height={80}
                    style={{
                      borderRadius: "8px",
                      objectFit: "cover",
                      border:
                        index === 0 ? "2px solid #006888" : "1px solid #ddd",
                    }}
                  />
                  {index === 0 && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        background: "#006888",
                        color: "#fff",
                        fontSize: "9px",
                        padding: "2px 4px",
                        borderRadius: "0 4px 0 8px",
                      }}
                    >
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      cursor: "pointer",
                      fontSize: "10px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* New Images */}
              {photosPrev.map((src, index) => (
                <div key={`new-${index}`} style={{ position: "relative" }}>
                  <Image
                    src={src}
                    alt={`New Preview ${index}`}
                    width={80}
                    height={80}
                    style={{
                      borderRadius: "8px",
                      objectFit: "cover",
                      opacity: 0.8,
                      border: "1px dashed #10b981",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      background: "#10b981",
                      color: "#fff",
                      fontSize: "9px",
                      padding: "2px 4px",
                      borderRadius: "0 4px 0 8px",
                    }}
                  >
                    New
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      cursor: "pointer",
                      fontSize: "10px",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button disabled={btnLoading} type="submit">
            {btnLoading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </article>

      {/* REVIEWS SECTION */}
      <div className="admin-review-section">
        <h2>Manage Reviews</h2>
        <div className="review-section-inner">
          <div className="admin-review-card">
            <h3>Add / Edit Review as Admin</h3>
            <ReviewForm productId={productId ?? ""} />
          </div>

          <div className="admin-reviews-list">
            <h3>Existing Reviews ({reviews?.length || 0})</h3>
            {reviews?.map((review: Review) => (
              <div key={review._id}>
                <div>
                  <strong>{review.name}</strong>
                  <span>{review.rating} ★</span>
                  <p>{review.comment}</p>
                </div>
                <button onClick={() => reviewDeleteHandler(review._id)}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductManagement;
