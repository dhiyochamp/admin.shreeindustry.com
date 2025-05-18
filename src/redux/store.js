import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "@/redux/dataSlice.js";
import authSlice from "@/redux/authSlice.js";
import couponSlice from "@/redux/couponSlice.js";
export const store = configureStore({
  reducer: {
    data: dataReducer,
    auth: authSlice,
    coupon: couponSlice,
  },
});

export default store;
