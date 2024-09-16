// filtersSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  region: "",
  ff_manager: "",
  product_manager: "",
};

const mrsSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setRegion: (state, action) => {
      state.region = action.payload;
    },
    setFf_manager: (state, action) => {
      state.ff_manager = action.payload;
    },
    setProduct_manager: (state, action) => {
      state.product_manager = action.payload;
    },
    resetFilters: (state) => {
      state.region = "";
      state.ff_manager = "";
      state.product_manager = "";
    },
  },
});

export const { setRegion, setFf_manager, setProduct_manager, resetFilters } = mrsSlice.actions;

export const selectFilters = (state) => state.filters;

export default mrsSlice.reducer;
