"use client";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import AuthListener from "./AuthListener";

export default function Providers({ children }: { children: ReactNode }) {

  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthListener>
        {children}
        </AuthListener>
      </QueryClientProvider>
    </Provider>
  );
}
