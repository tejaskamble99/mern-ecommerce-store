import {
BarResponse,
LineResponse,
PieResponse,
StatsResponse,
} from "@/types/api-types";

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

export const dashboardApi = createApi({
reducerPath: "dashboardApi",
baseQuery: baseQueryWithAuth,

endpoints: (builder) => ({
stats: builder.query<StatsResponse, void>({
query: () => "dashboard/stats",
keepUnusedDataFor: 0,
}),

pie: builder.query<PieResponse, void>({
  query: () => "dashboard/pie",
  keepUnusedDataFor: 0,
}),

bar: builder.query<BarResponse, void>({
  query: () => "dashboard/bar",
  keepUnusedDataFor: 0,
}),

line: builder.query<LineResponse, void>({
  query: () => "dashboard/line",
  keepUnusedDataFor: 0,
}),

}),
});

export const {
useStatsQuery,
usePieQuery,
useBarQuery,
useLineQuery,
} = dashboardApi;