"use client";
import { useState, useEffect, Suspense } from "react";
import ProductCard from "./../../../components/layout/ProductCard";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "@/redux/api/productApi";
import { CustomError } from "@/types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/admin/Loader";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { CartItem } from "@/types/types";
import { addToCart } from "@/redux/reducer/cartReducer";
import { useSearchParams } from "next/navigation";

function SearchContent() {

  const searchParams = useSearchParams();

  
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [category, setCategory] = useState(
    searchParams.get("category") ?? ""
  );
  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    setCategory(searchParams.get("category") ?? "");
    setSearch(searchParams.get("search") ?? "");
    setPage(1);
  }, [searchParams]);


  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery();

  const {
    isLoading: productLoading,
    data: searchData,
    isError: productIsError, // FIX 3
    error: productError,
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });

  const dispatch = useDispatch<AppDispatch>();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");

    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  const totalPages = searchData?.totalPage ?? 1;
  const isPrevPage = page > 1;
  const isNextPage = page < totalPages;

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);
  useEffect(() => {
    if (productIsError) {
      const err = productError as CustomError;
      toast.error(err.data.message);
    }
  }, [productIsError, productError]);

  return (
    <div className="search-page">
      <aside>
        <h2>Filters</h2>

        <div>
          <h4>Sort</h4>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low )</option>
          </select>
        </div>

        <div>
          <h4>Max Price : ₹{maxPrice.toLocaleString("en-IN")}</h4>
          <input
            type="range"
            min={100}
            max={200000}
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(Number(e.target.value));
              setPage(1);
            }}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        {productLoading ? (
          <Skeleton />
        ) : (
          <div className="search-product-list">
            {searchData?.products.map((i) => (
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
          </div>
        )}

        {searchData && searchData.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchData.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<Skeleton />}>
      <SearchContent />
    </Suspense>
  );
}