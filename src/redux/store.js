import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import uiReducer from "./ui/uiSlice";
import reservationReducer from "./reservation/reservationSlice";
import mrsReducer from "./mrs/mrsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    reservation: reservationReducer,
    mrsSlice: mrsReducer,
  },
});
