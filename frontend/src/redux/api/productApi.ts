import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  AllProductsResponse,
  CategoriesResponse,
  CategoriesWithImageResponse,
  DeleteProductRequest,
  MessageResponse,
  NewProductRequest,
  ProductResponse,
  SearchProductsRequest,
  SearchProductsResponse,
  UpdateProductRequest,
} from "@/types/api-types";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/product/`,
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    latestProducts: builder.query<AllProductsResponse, void>({
      query: () => `latest`,
      providesTags: ["Products"],
    }),
    allAdminProducts: builder.query<AllProductsResponse, string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["Products"],
    }),
    allProducts: builder.query<AllProductsResponse, void>({
      query: () => `all`,
      providesTags: ["Products"],
    }),
    categories: builder.query<CategoriesResponse, void>({
      query: () => `categories`,
      providesTags: ["Products"],
    }),
      categoriesImage: builder.query<CategoriesWithImageResponse, void>({
      query: () => `categories-with-image`,
      providesTags: ["Products"],
    }),
    searchProducts: builder.query<SearchProductsResponse,SearchProductsRequest>({
      query: ({ price, search, sort, category, page }) => {
        let base = `all?search=${search}&page=${page}`;
        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;
        return base;
      },
      providesTags: ["Products"],
    }),
     productDetails: builder.query<ProductResponse, string>({
      query: (id) => id,
      providesTags: ["Products"],
    }),
    newProducts: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({formData, id}) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
     updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ formData, userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
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
} = productApi;
