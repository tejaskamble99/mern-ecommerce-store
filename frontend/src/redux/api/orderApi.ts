import {
  AllOrdersResponse,
  MessageResponse,
  NewOrderRequest,
  OrderDetailsResponse,
} from "@/types/api-types";

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["orders"],

  endpoints: (builder) => ({
    // Create new order
    newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
      query: (order) => ({
        url: "order/new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["orders"],
    }),

    // Update order status (admin)
    // FIX: Removed userId. The backend knows who you are from the token!
    updateOrder: builder.mutation<MessageResponse, string>({
      query: (orderId) => ({
        url: `order/${orderId}`, // FIX: Added "order/" prefix
        method: "PUT",
      }),
      invalidatesTags: ["orders"],
    }),

    // Delete order (admin)
    // FIX: Removed userId.
    deleteOrder: builder.mutation<MessageResponse, string>({
      query: (orderId) => ({
        url: `order/${orderId}`, // FIX: Added "order/" prefix
        method: "DELETE",
      }),
      invalidatesTags: ["orders"], // FIX: Added invalidation so the UI updates automatically!
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