import {configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userApi";
import { userReducer } from "./reducer/userReducer";
import { productApi } from "./api/productApi";


export const server = process.env.NEXT_PUBLIC_SERVER_URL

export const store = configureStore({ 
    reducer: {
        [userApi.reducerPath] : userApi.reducer,
        [productApi.reducerPath] : productApi.reducer,
        [userReducer.name] : userReducer.reducer,
    } ,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware , productApi.middleware),

});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;