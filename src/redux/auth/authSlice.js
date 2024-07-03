// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  userId: localStorage.getItem("userId"),
  userRole: localStorage.getItem("userRole"),
  username: localStorage.getItem("username"),
  regionId: localStorage.getItem("regionId"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = !!action.payload.accessToken;
      state.userId = action.payload.userId;
      state.userRole = action.payload.userRole;
      state.username = action.payload.username;
      state.regionId = action.payload.regionId;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("userRole", action.payload.userRole);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("regionId", action.payload.regionId);
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.userId = null;
      state.userRole = null;
      state.username = null;
      state.regionId = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      localStorage.removeItem("regionId");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
