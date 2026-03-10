"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";
import ProductCard from "@/components/layout/ProductCard";
import toast from "react-hot-toast";
import { useLatestProductsQuery } from "@/redux/api/productApi";
import { Skeleton } from "@/components/admin/Loader";
import { CartItem } from "@/types/types";
// import CategoryCard from "@/components/layout/CategoryCard";
import { useDispatch } from 'react-redux';
import { addToCart} from "@/redux/reducer/cartReducer";
import { AppDispatch } from "@/redux/store";

const banners = [
  "/assets/images/cover.jpg",
  "/assets/images/cover1.jpg",
  "/assets/images/cover2.jpg",
  "/assets/images/cover3.jpg",
];

export default function Home() {
  const { data, isLoading, isError } = useLatestProductsQuery();

  const dispatch = useDispatch<AppDispatch>();
  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };
  if(isError) toast.error("Cannot Fetch the Products");

  return (
    <div className="home">
      <section className="hero">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
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

      {/* <section className="category-section">
        <h1>Browse Categories</h1>

        <div className="cat-grid">
          {(data as any).categories.map((cat: any, index: number) => (
            <CategoryCard
              key={index}
              name={cat.heading}
              count={cat.value}
              photo={cat.photo}
            />
          ))}
        </div>
      </section> */}
    
        <h1>
          Latest Products
          <Link href="/search" className="findmore">
            View All
          </Link>
        </h1>
        {isLoading ? (
          <Skeleton width="80vw " length ={3}/>
        ) : isError ? (
          <p>Something went wrong. Please try again later.</p>
        ) : (
          <main>
            {data?.products.map((i) => (
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
    
    </div>
  );
}
