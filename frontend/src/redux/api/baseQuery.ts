import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/firebase";

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/`,
  prepareHeaders: async (headers) => {
    const user = auth.currentUser;

    if (user) {
     const token = await user.getIdToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return headers;
  },
});