// uiSlice.js or similar file
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidenavVisible: false, // Initialize with sidenav visible
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidenavVisibility(state) {
      state.isSidenavVisible = !state.isSidenavVisible;
    },
  },
});

export const { toggleSidenavVisibility } = uiSlice.actions;

export default uiSlice.reducer;
