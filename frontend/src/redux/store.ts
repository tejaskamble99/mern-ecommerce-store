import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { cartReducer } from "./reducer/cartReducer";
import { userReducer } from "./reducer/userReducer";
import { userApi } from "./api/userApi";
import { productApi } from "./api/productApi";
import { orderApi } from "./api/orderApi";

export const server = process.env.NEXT_PUBLIC_SERVER_URL;

const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
});

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();
    
const cartPersistConfig = {
  key: "cart",
  storage,
};

const persistedCartReducer = persistReducer(
  cartPersistConfig,
  cartReducer.reducer,
);

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [userReducer.name]: userReducer.reducer,
    cartReducer: persistedCartReducer, // 👈 persisted
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(userApi.middleware, productApi.middleware, orderApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
