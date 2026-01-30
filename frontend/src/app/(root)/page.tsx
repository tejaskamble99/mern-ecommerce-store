"use client";
import Link from "next/link";
import data from "@/assets/data.json";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";
import ProductCard from "@/components/layout/ProductCard";

const banners = [
  "/assets/images/cover.jpg",
  "/assets/images/cover1.jpg",
  "/assets/images/cover2.jpg",
  "/assets/images/cover3.jpg",
];

export default function Home() {
  const addToCartHandler = () => {
    console.log("Added to cart");
  };

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
          {banners.map((src, index) => (
            <SwiperSlide key={index}>
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
      <br />
      <h1>
        Latest Products
        <Link href="/search" className="findmore">
          View All
        </Link>
      </h1>

      <ProductCard
        productId="qedcsd"
        name="Logitech MX Master 3S"
        price={9500}
        stock={6}
        photo={
          "https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png?v=1"
        }
        handler={addToCartHandler}
      />
    </div>
  );
}
