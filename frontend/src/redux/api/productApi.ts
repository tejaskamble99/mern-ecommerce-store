import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { AllProductsResponse, CategoriesResponse } from "@/types/api-types";




export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/product/`,
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    latestProducts:builder.query<AllProductsResponse,  void>({
      query: () => `latest`,
       providesTags: ["Products"],
    }),
    allAdminProducts:builder.query<AllProductsResponse,  string>({
      query: (id) => `admin-products?id=${id}`,
      providesTags: ["Products"],
       
    }),
    allProducts:builder.query<AllProductsResponse,  void>({
      query: () => `all`,
      providesTags: ["Products"],
       
    }),
    categoriesProducts:builder.query<CategoriesResponse,  void>({
      query: () => `categories`,
      providesTags: ["Products"],
       
    })
  }),
});

export const {
  useLatestProductsQuery,
  useAllAdminProductsQuery,
  useAllProductsQuery,
} = productApi;



