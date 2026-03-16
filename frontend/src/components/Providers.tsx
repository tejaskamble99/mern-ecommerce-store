"use client";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store";
import AuthListener from "./AuthListener";
import { Provider } from "react-redux";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <AuthListener>
            {children}
          </AuthListener>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}