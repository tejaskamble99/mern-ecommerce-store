import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/user/`,
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
   
  }),
});



export const { 
 
 } = dashboardApi;
