"use client";

import {
  useProductDetailsQuery,
  useLatestProductsQuery,
} from "@/redux/api/productApi";
import { addToCart } from "@/redux/reducer/cartReducer";
import { AppDispatch, server } from "@/redux/store";
import { CartItem } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMinus, FaPlus, FaShoppingCart, FaTag, FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Skeleton } from "@/components/admin/Loader";
import ProductCard from "@/components/layout/ProductCard";
import Link from "next/link";
import Image from "next/image";
import ReviewForm from "@/components/layout/product/ReviewForm";
import ReviewList from "@/components/layout/product/ReviewList";
import RatingBreakdown from "@/components/layout/product/RatingBreakdown";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const { data, isLoading, isError } = useProductDetailsQuery(id ?? "", {
    skip: !id,
  });

  const { data: latestData } = useLatestProductsQuery();

  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);

  useEffect(() => {
    if (isError) {
      toast.error("Product not found");
      router.push("/search");
    }
  }, [isError, router]);

  const product = data?.product;
  const isOutOfStock = (product?.stock ?? 0) < 1;

  const buildImgUrl = (path?: string) =>
    path && path.startsWith("http") ? path : `${server}/${path}`;

  const incrementQty = () => {
    if (!product) return;
    if (quantity >= product.stock) return toast.error("Max stock reached");
    setQuantity((q) => q + 1);
  };

  const decrementQty = () => {
    if (quantity <= 1) return;
    setQuantity((q) => q - 1);
  };

  const addToCartHandler = () => {
    if (!product) return;
    if (isOutOfStock) return toast.error("Out of Stock");
    dispatch(
      addToCart({
        productId: product._id,
        photo: product.photo,
        name: product.name,
        price: product.price,
        quantity,
        stock: product.stock,
      }),
    );
    toast.success("Added to Cart");
  };

  const addRelatedToCart = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  const relatedProducts =
    latestData?.products?.filter(
      (p) => p.category === product?.category && p._id !== product?._id
    ) ?? [];

  if (isLoading) {
    return (
      <div className="product-page">
        <Skeleton length={10} />
      </div>
    );
  }

  if (!product) return null;

  const imgUrl = buildImgUrl(product.photo);

  return (
    <div key={id} className="product-page">
      <nav className="product-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={`/search?category=${product.category}`}>
          {product.category}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <section className="product-detail">
        {/* LEFT — Image Gallery */}
        <div className="product-gallery">
          <div className="gallery-main">
            <Image
              src={imgUrl}
              alt={product.name}
              width={500}
              height={500}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              priority
            />
          </div>

          <div className="gallery-thumbs">
            {[imgUrl, imgUrl, imgUrl].map((src, i) => (
              <button
                key={i}
                className={`thumb ${activeThumb === i ? "active" : ""}`}
                onClick={() => setActiveThumb(i)}
              >
                <Image
                  src={src}
                  alt={`view ${i + 1}`}
                  width={100}
                  height={100}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info">
          <div className="product-tags">
            <span className="tag category">
              <FaTag /> {product.category}
            </span>
            {!isOutOfStock && <span className="tag new">New Arrival</span>}
          </div>

          <h1 className="product-name">{product.name}</h1>

          {/* ✅ Dynamic Product Ratings */}
          <div className="product-rating">
            {[1, 2, 3, 4, 5].map((s) => {
              const ratingVal = Math.round(product.ratings || 0);
              return (
                <FaStar 
                  key={s} 
                  className={s <= ratingVal ? "filled" : "empty"} 
                  color={s <= ratingVal ? "#f59e0b" : "#ddd"} 
                />
              );
            })}
            <span>{product.ratings?.toFixed(1) || "0.0"}</span>
            <span className="review-count">· {product.numOfReviews || 0} reviews</span>
          </div>

          <p className="product-price">
            {product.price.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })}
          </p>
          <h5>Inclusive of all taxes</h5>

          {!isOutOfStock && (
            <div className="product-qty-row">
              <span>Quantity</span>
              <div className="product-qty">
                <button onClick={decrementQty} disabled={quantity <= 1}>
                  <FaMinus />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={incrementQty}
                  disabled={quantity >= product.stock}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          )}

          <button
            className={`product-add-btn ${isOutOfStock ? "disabled" : ""}`}
            onClick={addToCartHandler}
            disabled={isOutOfStock}
          >
            <FaShoppingCart />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </section>
      
      <div className="product-detail-divider">
        <p>{product.description}</p>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="related-header">
            <div>
              <h2>You May Like</h2>
              <p>More products from the same category</p>
            </div>
            <Link
              href={`/search?category=${product.category}`}
              className="view-more-btn"
            >
              View More
            </Link>
          </div>
          <div className="related-grid">
            {relatedProducts.slice(0, 4).map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                photo={i.photo}
                handler={addRelatedToCart}
              />
            ))}
          </div>
        </section>
      )}

      {/* ✅ Complete Review System Integration */}
      <section className="product-reviews-section" style={{ marginTop: "40px" }}>
        <h2>Customer Reviews</h2>
        
        <div 
          className="reviews-layout" 
          style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "20px" }}
        >
          {/* Left Column: Stats & Form */}
          <div className="reviews-left" style={{ flex: "1", minWidth: "300px" }}>
            <RatingBreakdown reviews={product.reviews || []} />
            
            <div style={{ marginTop: "30px" }}>
              <h3>Write a Review</h3>
              <ReviewForm productId={product._id} />
            </div>
          </div>

          {/* Right Column: The actual reviews */}
          <div className="reviews-right" style={{ flex: "2", minWidth: "300px" }}>
            <ReviewList reviews={product.reviews || []} />
          </div>
        </div>
      </section>
    </div>
  );
}