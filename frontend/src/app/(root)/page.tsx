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

// Fallback banners if none in DB
const FALLBACK_BANNERS = [
  "/assets/images/cover.jpg",
  "/assets/images/cover1.jpg",
  "/assets/images/cover2.jpg",
  "/assets/images/cover3.jpg",
];

export default function Home() {
  // Banner queries
  const { data: heroBannerData } = useGetBannersQuery("hero");
  const { data: promoBannerData } = useGetBannersQuery("promo");
  const { data: bottomBannerData } = useGetBannersQuery("bottom");

  // Product + category queries
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

  // Build hero banner URLs — fallback to local images if DB is empty
  const heroUrls =
    heroBannerData?.banners && heroBannerData.banners.length > 0
      ? heroBannerData.banners.map((b) =>
          b.image.startsWith("http") ? b.image : `${server}/${b.image}`
        )
      : FALLBACK_BANNERS;

  const promoBanner = promoBannerData?.banners[0];
  const bottomBanner = bottomBannerData?.banners[0];

  const buildImgUrl = (path: string) =>
    path.startsWith("http") ? path : `${server}/${path}`;

  return (
    <div className="home">

      {/* ── Hero Banner ── */}
      <section className="hero">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          loop={heroUrls.length > 1}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="hero-swiper"
        >
          {heroUrls.map((src) => (
            <SwiperSlide key={src}>
              <img src={src} alt="banner" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* <div className="hero-content">
          <h1>Tech that Defines You.</h1>
          <p>
            Upgrade your lifestyle with the latest gadgets.
            <br />
            Best prices, genuine quality.
          </p>
          <Link href="/search" className="hero-btn">
            Shop Now
          </Link>
        </div> */}
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

      {/* ── Promo Banner ── */}
      {promoBanner && (
        <div className="promo-banner">
          <img src={buildImgUrl(promoBanner.image)} alt="Promotion" />
        </div>
      )}

      {/* ── Latest Products ── */}
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
        <p className="empty-state">Something went wrong. Please try again later.</p>
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
              stock={i.stock}
              photo={i.photo}
              handler={addToCartHandler}
            />
          ))}
        </main>
      )}

      {/* ── Bottom Banner ── */}
      {bottomBanner && (
        <div className="bottom-banner">
          <img src={buildImgUrl(bottomBanner.image)} alt="Promotion" />
        </div>
      )}

      {/* ── Features Row ── */}
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