"use client";
import Link from "next/link";
import data from "@/assets/data.json";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";
import Productcard from "@/components/layout/Productcard";


const banners = [
  "/assets/images/cover.jpg",
  "/assets/images/cover1.jpg",
  "/assets/images/cover2.jpg",
  "/assets/images/cover3.jpg",
];

export default function Home() {
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
          <SwiperSlide key ={index}>
            <img src={src} alt="banner" />
          </SwiperSlide>
        ))}   
        
        </Swiper>

        <div className="hero-content">
          <h1>
            Tech that  Defines You.
          </h1>
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
      <Productcard  />
    </div>
  );
}
