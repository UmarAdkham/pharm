// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  userRole: localStorage.getItem("userRole"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = !!action.payload.accessToken;
      state.userRole = action.payload.userRole;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("userRole", action.payload.userRole);
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.userRole = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userRole");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
