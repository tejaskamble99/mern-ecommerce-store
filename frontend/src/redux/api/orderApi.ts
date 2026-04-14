import {
  AllOrdersResponse,
  MessageResponse,
  NewOrderRequest,
  OrderDetailsResponse,
} from "@/types/api-types";

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";
import { auth } from "@/firebase";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["orders"],

  endpoints: (builder) => ({
newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
  query: (order) => ({
    url: `order/new`,
    method: "POST",
    body: order,
  }),
      invalidatesTags: ["orders"],
    }),

    updateOrder: builder.mutation<MessageResponse, string>({
      query: (orderId) => ({
        url: `order/${orderId}`,
        method: "PUT",
      }),
      invalidatesTags: ["orders"],
    }),

    deleteOrder: builder.mutation<MessageResponse, string>({
      query: (orderId) => ({
        url: `order/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),

    // Current user orders
    myOrders: builder.query<AllOrdersResponse, void>({
      query: () => "order/my",
      providesTags: ["orders"],
    }),

    // Admin orders list
    allOrders: builder.query<AllOrdersResponse, void>({
      query: () => "order/all",
      providesTags: ["orders"],
    }),

    // Single order details
    orderDetails: builder.query<OrderDetailsResponse, string>({
      query: (id) => `order/${id}`,
      providesTags: ["orders"],
    }),
  }),
});

export const {
  useNewOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useMyOrdersQuery,
  useAllOrdersQuery,
  useOrderDetailsQuery,
} = orderApi;
