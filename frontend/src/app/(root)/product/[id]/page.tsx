"use client";

import { useProductDetailsQuery, useLatestProductsQuery } from "@/redux/api/productApi";
import { addToCart } from "@/redux/reducer/cartReducer";
import { AppDispatch, server } from "@/redux/store";
import { CartItem } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMinus, FaPlus, FaShoppingCart, FaTag, FaBox } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Skeleton } from "@/components/admin/Loader";
import ProductCard from "@/components/layout/ProductCard";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const { data, isLoading, isError } = useProductDetailsQuery(id!, {
    skip: !id,
  });

  const { data: latestData } = useLatestProductsQuery();

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isError) {
      toast.error("Product not found");
      router.push("/search");
    }
  }, [isError, router]);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [id]);

  const product = data?.product;
  const isOutOfStock = (product?.stock ?? 0) < 1;

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

    const cartItem: CartItem = {
      productId: product._id,
      photo: product.photo,
      name: product.name,
      price: product.price,
      quantity,
      stock: product.stock,
    };

    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  // Related products — same category, exclude current
  const relatedProducts = latestData?.products.filter(
    (p) => p.category === product?.category && p._id !== product?._id
  );

  const addRelatedToCart = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  const buildImgUrl = (path: string) =>
    path?.startsWith("http") ? path : `${server}/${path}`;

  if (isLoading) {
    return (
      <div className="product-page">
        <Skeleton length={8} />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="product-page">

      {/* ── Main Product Section ── */}
      <section className="product-detail">

        {/* Left — Image */}
        <div className="product-image">
          <img src={buildImgUrl(product.photo)} alt={product.name} />
        </div>

        {/* Right — Info */}
        <div className="product-info">

          <div className="product-category">
            <FaTag />
            <span>{product.category}</span>
          </div>

          <h1>{product.name}</h1>

          <p className="product-price">
            {product.price.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })}
          </p>

          <div className={`product-stock ${isOutOfStock ? "out" : "in"}`}>
            <FaBox />
            <span>{isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}</span>
          </div>

          <p className="product-description">{product.description}</p>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="product-qty">
              <button onClick={decrementQty} disabled={quantity <= 1}>
                <FaMinus />
              </button>
              <span>{quantity}</span>
              <button onClick={incrementQty} disabled={quantity >= product.stock}>
                <FaPlus />
              </button>
            </div>
          )}

          {/* Add to Cart */}
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

      {/* ── Related Products ── */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>Related Products</h2>
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

    </div>
  );
}