"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Props {
  children: ReactNode;
  adminOnly?: boolean;
  redirect?: string;
  loadingFallback?: ReactNode; 
}


function DefaultSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
    </div>
  );
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
  redirect = "/login",
  loadingFallback = <DefaultSpinner />, 
}: Props) {
  const { user, loading } = useSelector((state: RootState) => state.userReducer);
  const router = useRouter();

  useEffect(() => {
   
    if (loading) return;

    if (!user) {
      router.push(redirect);
    } else if (adminOnly && user.role !== "admin") {
      router.push("/");
    }
  }, [user, loading, adminOnly, router, redirect]);

 
  if (loading) return <>{loadingFallback}</>;

  // Prevent rendering children before redirect fires
  if (!user) return null;
  if (adminOnly && user.role !== "admin") return null;

  return <>{children}</>;
}