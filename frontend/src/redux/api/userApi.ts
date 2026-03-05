import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse, UserResponse } from "@/types/api-types";
import { User } from "@/types/types";
import axios from "axios";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/`,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const getUser = async (id: string) => {
  const { data }: { data: UserResponse } = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/${id}`,
  );

  return data;
};

export const { useLoginMutation } = userApi;
