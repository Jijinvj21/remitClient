import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./features/loginReducer";


const store = configureStore({
    reducer: {
        login: loginReducer
    }
})

export default store
