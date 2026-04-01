import { createApi } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "@/types/api-types";
import { baseQueryWithAuth } from "./baseQuery";

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
  baseQuery: baseQueryWithAuth,
  tagTypes: ["banners"],

  endpoints: (builder) => ({
    getBanners: builder.query<BannersResponse, BannerSlot | void>({
      query: (slot) =>
        slot ? `banner/all?slot=${slot}` : "banner/all",
      providesTags: ["banners"],
    }),

    addBanner: builder.mutation<MessageResponse, FormData>({
      query: (formData) => ({
        url: "banner/new",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["banners"],
    }),

    updateBanner: builder.mutation<
      MessageResponse,
      { bannerId: string; formData: FormData }
    >({
      query: ({ bannerId, formData }) => ({
        url: `banner/${bannerId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["banners"],
    }),

    deleteBanner: builder.mutation<MessageResponse, string>({
      query: (bannerId) => ({
        url: `banner/${bannerId}`,
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