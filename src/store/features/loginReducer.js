import { createSlice } from "@reduxjs/toolkit";


const loginSlices = createSlice({
    name:"login",
    initialState:{
        token:""
    },
    reducers:{
        addToken : (state,action)=>{
            state.token=action.payload;
        },
     
        clearToken : (state,action)=>{
            state.token = "";
        }
    }
})
export const{addToken,removeToken} = loginSlices.actions
export default loginSlices.reducer