import { auth } from "@/firebase";
import {
  AllUsersResponse,
  MessageResponse,
  UserResponse,
} from "@/types/api-types";
import { User } from "@/types/types";
import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { baseQueryWithAuth } from "./baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["users"],

  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "user/new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),

    deleteUser: builder.mutation<MessageResponse, string>({
      query: (userId) => ({
        url: `user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"], 
    }),

    allUsers: builder.query<AllUsersResponse, void>({
      query: () => "user/all",
      providesTags: ["users"],
    }),
  }),
});

export const getUser = async (id: string) => {
  const token = await auth.currentUser?.getIdToken();

  const { data }: { data: UserResponse } = await axios.get(
  
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

export const { useLoginMutation, useDeleteUserMutation, useAllUsersQuery } =
  userApi;