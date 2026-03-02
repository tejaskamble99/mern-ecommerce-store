"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase"; 
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "@/redux/reducer/userReducer";
import { getUser } from "@/redux/api/userApi";

export default function AuthListener({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 1. Wrap the Axios call in a try block
          const data = await getUser(user.uid);
          dispatch(userExist(data.user));
        } catch (error) {
          // 2. If the backend fails, securely log them out of the frontend
          console.error("Failed to fetch user from database");
          dispatch(userNotExist());
        }
      } else {
        dispatch(userNotExist());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}