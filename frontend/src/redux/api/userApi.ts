import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { server } from "../store";
import { MessageResponse } from "@/types/api-types";
import { User } from "@/types/types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const { useLoginMutation } = userApi;





// export const userApi = createApi({
//     reducerPath: "userApi",
//     baseQuery: fetchBaseQuery({
//         baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
//     }),
//     endpoints: (builder) => ({
//         getUser: builder.query({
//             query: (id) => `/user/${id}`,
//         }),
//     }),
// });
