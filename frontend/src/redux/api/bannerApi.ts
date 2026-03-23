import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "@/types/api-types";

export type BannerSlot = "hero" | "promo" | "bottom";

export type Banner = {
  _id: string;
  image: string;
  slot: BannerSlot;
};

export type BannersResponse = {
  success: boolean;
  banners: Banner[];
};

export const bannerApi = createApi({
  reducerPath: "bannerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/banner/`,
  }),
  tagTypes: ["banners"],
  endpoints: (builder) => ({
    getBanners: builder.query<BannersResponse, BannerSlot | void>({
      query: (slot) => (slot ? `all?slot=${slot}` : "all"),
      providesTags: ["banners"],
    }),
    addBanner: builder.mutation<MessageResponse, { formData: FormData; userId: string }>({
      query: ({ formData, userId }) => ({
        url: `new?id=${userId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["banners"],
    }),
    updateBanner: builder.mutation<MessageResponse, { formData: FormData; userId: string; bannerId: string }>({
      query: ({ formData, userId, bannerId }) => ({
        url: `${bannerId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["banners"],
    }),
    deleteBanner: builder.mutation<MessageResponse, { bannerId: string; userId: string }>({
      query: ({ bannerId, userId }) => ({
        url: `${bannerId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banners"],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;