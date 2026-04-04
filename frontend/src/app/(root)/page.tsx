"use client";
import { Skeleton } from "@/components/admin/Loader";
import CategoryCard from "@/components/layout/CategoryCard";
import ProductCard from "@/components/layout/ProductCard";
import { useGetBannersQuery } from "@/redux/api/bannerApi";
import {
  useCategoriesImageQuery,
  useLatestProductsQuery,
} from "@/redux/api/productApi";
import { addToCart } from "@/redux/reducer/cartReducer";
import { AppDispatch, server } from "@/redux/store";
import { CartItem } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaLock, FaShippingFast, FaUndo } from "react-icons/fa";
import { useDispatch } from "react-redux";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Home() {
  const { data: heroBannerData } = useGetBannersQuery("hero");
  const { data: promoBannerData } = useGetBannersQuery("promo");
  const { data: bottomBannerData } = useGetBannersQuery("bottom");

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

  useEffect(() => {
    if (productError) toast.error("Cannot fetch products");
    if (categoryError) toast.error("Cannot fetch categories");
  }, [productError, categoryError]);

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  const heroUrls =
    heroBannerData?.banners && heroBannerData.banners.length > 0
      ? heroBannerData.banners.map((b) =>
          b.image.startsWith("http") ? b.image : `${server}/${b.image}`,
        )
      : [];

  const promoBanner = promoBannerData?.banners?.[0];
  const bottomBanner = bottomBannerData?.banners?.[0];

  const buildImgUrl = (path: string) =>
    path.startsWith("http") ? path : `${server}/${path}`;

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-banner">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            loop={heroUrls.length > 1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="hero-swiper"
          >
            {heroUrls.map((src) => (
              <SwiperSlide key={src}>
                <Image
                  src={src}
                  alt="banner"
                  fill
                  priority
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="category-section">
        <h1>POPULAR CATEGORIES</h1>
        {categoryLoading ? (
          <Skeleton width="80vw" length={4} />
        ) : !categoryData?.categories.length ? (
          <p className="empty-state">No categories found.</p>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={2}
            loop={(categoryData.categories.length ?? 0) > 2}
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
            {categoryData.categories.map((i) => (
              <SwiperSlide key={i.category}>
                <CategoryCard name={i.category} photo={i.image} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {promoBanner && (
        <div className="promo-banner">
          <Image
            src={buildImgUrl(promoBanner.image)}
            alt="Promotion"
            width={0}
            height={0}
          />
        </div>
      )}

      <h1>
        Latest Products
        <Link href="/search" className="findmore">
          View All
        </Link>
      </h1>

      <div className="promo-text">
        <h2>Power Up for Less – Limited Time Deals!</h2>
      </div>

      {productLoading ? (
        <Skeleton width="80vw" length={3} />
      ) : productError ? (
        <p className="empty-state">
          Something went wrong. Please try again later.
        </p>
      ) : !productData?.products.length ? (
        <p className="empty-state">No products available right now.</p>
      ) : (
        <main>
          {productData.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              salePrice={i.salePrice}
              stock={i.stock}
              photo={i.photo}
              handler={addToCartHandler}
            />
          ))}
        </main>
      )}

      {bottomBanner && (
        <div className="bottom-banner">
          <Image
            src={buildImgUrl(bottomBanner.image)}
            alt="Promotion"
            width={0}
            height={0}
          />
        </div>
      )}

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
