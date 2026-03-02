import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { server } from "../store";
import { MessageResponse, UserResponse } from "@/types/api-types";
import { User } from "@/types/types";
import axios from "axios";


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

export const getUser = async (id: string) => {
  try{
    const {data} : {data : UserResponse} = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/${id}`);
   
    return data;
  }catch(error){
    throw error;
  }
};

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
