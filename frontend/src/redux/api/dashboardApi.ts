import { BarResponse, LineResponse, PieResponse, StatsResponse } from "@/types/api-types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/dashboard/`,
  }),
  tagTypes: ["charts"],
  endpoints: (builder) => ({
   stats: builder.query<StatsResponse , string>({
     query: (id) => `stats?id=${id}`,
     providesTags: ["charts"],
   }),
   pie: builder.query<PieResponse , string>({
     query: (id) => `pie?id=${id}`,
     providesTags: ["charts"],
   }),
      bar: builder.query<BarResponse , string>({
     query: (id) => `bar?id=${id}`,
     providesTags: ["charts"],
   }),
      line: builder.query<LineResponse , string>({
     query: (id) => `line?id=${id}`,
     providesTags: ["charts"],
   }),
  }),
});



export const { 
 useStatsQuery,
 usePieQuery,
 useBarQuery,
 useLineQuery
 } = dashboardApi;
