import {
  AllOrdersResponse,
  MessageResponse,
  NewOrderRequest,
  UpdateOrderRequest,
} from "@/types/api-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/order/`,
  }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
      query: (order) => ({
        url: "new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["orders"],
    }),
    updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({userId , orderId}) => ({
        url:`${orderId}?id=${userId}`,
        method: "PUT",
   
      }),
      invalidatesTags: ["orders"],
    }),
     deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({
      query: ({userId , orderId}) => ({
        url:`${orderId}?id=${userId}`,
        method: "DELETE",
   
      }),
      invalidatesTags: ["orders"],
    }),
    myOrder: builder.query<AllOrdersResponse, string>({
      query: (id) => `my?id=${id}`,
      providesTags: ["orders"],
    }),
    allOrder: builder.query<AllOrdersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["orders"],
    }),
    orderDetails: builder.query<AllOrdersResponse, string>({
      query: (id) => id,
      providesTags: ["orders"],
    }),
  }),
});

export const { useNewOrderMutation ,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
    useMyOrderQuery,
    useAllOrderQuery,
    useOrderDetailsQuery
 } = orderApi;
