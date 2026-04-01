// redux/api/baseQuery.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "@/firebase"; 

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/`,
  prepareHeaders: async (headers) => {
    // 1. Get the current user
    const user = auth.currentUser;

    if (user) {
      
      const token = await user.getIdToken(true); 
      
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } else {
       console.warn("No user found in Firebase Auth during baseQuery");
    }
    
    return headers;
  },
});