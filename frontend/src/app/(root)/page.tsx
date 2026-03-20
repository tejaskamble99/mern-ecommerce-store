"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import ProductCard from "@/components/layout/ProductCard";
import CategoryCard from "@/components/layout/CategoryCard";
import toast from "react-hot-toast";
import { useLatestProductsQuery, useCategoriesImageQuery } from "@/redux/api/productApi";
import { Skeleton } from "@/components/admin/Loader";
import { CartItem } from "@/types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/reducer/cartReducer";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { FaShippingFast, FaLock, FaUndo } from "react-icons/fa";
import "swiper/css/navigation";

const banners = [
  "/assets/images/cover.jpg",
  "/assets/images/cover1.jpg",
  "/assets/images/cover2.jpg",
  "/assets/images/cover3.jpg",
];

export default function Home() {
  // FIX: separate queries for products and categories
  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
  } = useLatestProductsQuery();

  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useCategoriesImageQuery();

  const dispatch = useDispatch<AppDispatch>();

  // FIX: toast in useEffect, not during render
  useEffect(() => {
    if (productError) toast.error("Cannot fetch products");
    if (categoryError) toast.error("Cannot fetch categories");
  }, [productError, categoryError]);

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  return (
    <div className="home">
      {/* Hero Banner */}
      <section className="hero">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="hero-swiper"
        >
          {banners.map((src) => (
            <SwiperSlide key={src}>
              <img src={src} alt="banner" />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="hero-content">
          <h1>Tech that Defines You.</h1>
          <p>
            Upgrade your lifestyle with the latest gadgets. <br />
            Best prices, genuine quality.
          </p>
          <Link href="/search" className="hero-btn">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      {/* Categories */}
      <section className="category-section">
        <h1>POPULAR CATEGORIES</h1>
        {categoryLoading ? (
          <Skeleton width="80vw" length={4} />
        ) : (
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={2}
            loop={(categoryData?.categories.length ?? 0) > 2}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            navigation
            breakpoints={{
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            className="cat-swiper"
          >
            {/* FIX: Removed the <main> tag here! */}
            {categoryData?.categories.map((i) => (
              <SwiperSlide key={i.category}>
                <CategoryCard name={i.category} photo={i.image} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* Latest Products */}
      <h1>
        Latest Products
        <Link href="/search" className="findmore">
          View All
        </Link>
      </h1>

      {productLoading ? (
        <Skeleton width="80vw" length={3} />
      ) : productError ? (
        <p>Something went wrong. Please try again later.</p>
      ) : (
        <main>
          {productData?.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              photo={i.photo}
              handler={addToCartHandler}
            />
          ))}
        </main>
      )}

      {/* Features Row */}
      <section className="features">
        <div className="feature-item">
          <FaShippingFast />
          <div>
            <h4>Free Shipping</h4>
            <p>On orders above ₹1,000</p>
          </div>
        </div>
        <div className="feature-item">
          <FaLock />
          <div>
            <h4>Secure Payment</h4>
            <p>100% secure transactions</p>
          </div>
        </div>
        <div className="feature-item">
          <FaUndo />
          <div>
            <h4>Easy Returns</h4>
            <p>30-day return policy</p>
          </div>
        </div>
      </section>
    </div>
  );
}