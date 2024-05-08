// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: localStorage.getItem("accessToken") || null,
  userRole: localStorage.getItem("userRole") || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = !!action.payload.accessToken;
      state.userRole = action.payload.userRole;
      localStorage.setItem("accessToken", action.payload.accessToken); // Store token
      localStorage.setItem("userRole", action.payload.userRole);
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken"); // Clear token
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
