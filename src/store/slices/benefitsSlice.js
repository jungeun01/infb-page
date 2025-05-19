import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatas } from "../../pages/API/firebase";

export const fetchBenefits = createAsyncThunk(
  "benefits/fetchBenefits",
  async ({ collectionName, queryOptions }) => {
    const response = await getDatas(collectionName, queryOptions);
    return response;
  }
);

const benefitsSlice = createSlice({
  name: "benefits",
  initialState: {
    benefits: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBenefits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBenefits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.benefits = action.payload;
      })
      .addCase(fetchBenefits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default benefitsSlice.reducer;
