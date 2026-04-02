import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

import {
  AllProductsResponse,
  CategoriesResponse,
  CategoriesWithImageResponse,
  MessageResponse,
  ProductResponse,
  SearchProductsRequest,
  SearchProductsResponse,
} from "@/types/api-types";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Products"],

  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, void>({
      query: () => `product/latest`,
      providesTags: ["Products"],
    }),

    allAdminProducts: builder.query<AllProductsResponse, void>({
      query: () => `product/admin-products`,
      providesTags: ["Products"],
    }),

    allProducts: builder.query<AllProductsResponse, void>({
      query: () => `product/all`,
      providesTags: ["Products"],
    }),

    categories: builder.query<CategoriesResponse, void>({
      query: () => `product/categories`,
      providesTags: ["Products"],
    }),

    categoriesImage: builder.query<CategoriesWithImageResponse, void>({
      query: () => `product/categories-with-image`,
      providesTags: ["Products"],
    }),

    searchProducts: builder.query<
      SearchProductsResponse,
      SearchProductsRequest
    >({
      query: ({ price, search, sort, category, page }) => {
        let base = `product/all?search=${search}&page=${page}`;
        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;
        return base;
      },
      providesTags: ["Products"],
    }),

    productDetails: builder.query<ProductResponse, string>({
      query: (id) => `product/${id}`,
      providesTags: ["Products"],
    }),

    newProducts: builder.mutation<MessageResponse, FormData>({
      query: (formData) => ({
        url: `product/new`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation<
      MessageResponse,
      { productId: string; formData: FormData }
    >({
      query: ({ formData, productId }) => ({
        url: `product/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<MessageResponse, string>({
      query: (productId) => ({
        url: `product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    addReview: builder.mutation<MessageResponse, FormData>({
      query: (formData) => ({
        url: "product/review",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    getReviews: builder.query({
      query: (productId) => `product/reviews/${productId}`,
    }),

  
    deleteReview: builder.mutation<
      MessageResponse,
      { productId: string; reviewId: string }
    >({
      query: ({ productId, reviewId }) => ({
        url: `product/review?productId=${productId}&reviewId=${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllAdminProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useCategoriesImageQuery,
  useSearchProductsQuery,
  useNewProductsMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsQuery,
} = productApi;