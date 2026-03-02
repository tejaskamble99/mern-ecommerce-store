
import { createSlice } from "@reduxjs/toolkit";
 
import { UserReducerInitialState } from "@/types/reducer-types";
const initialState: UserReducerInitialState = {
    user: null,
    loading: true,
};

export const userReducer = createSlice({
    name: "userReducer",
    initialState,
    reducers:{
        userExist: (state , payload) =>{
            
            state.user = payload.payload;
            state.loading = false;
        }
    } ,
});