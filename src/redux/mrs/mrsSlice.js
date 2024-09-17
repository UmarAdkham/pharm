import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  medReps: [],
};

const monitoringSlice = createSlice({
  name: "med-reps",
  initialState,
  reducers: {
    setMedRepsData(state, action) {
      state.medReps = action.payload;
    },
  },
});

export const { setMedRepsData } = monitoringSlice.actions;

export default monitoringSlice.reducer;
