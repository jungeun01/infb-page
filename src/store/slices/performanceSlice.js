import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatas } from "../../../src/pages/API/firebase";

export const fetchPerformance = createAsyncThunk(
  "performance/fetchPerformance",
  async ({ collectionName, queryOptions }, { rejectWithValue }) => {
    try {
      const data = await getDatas(collectionName, queryOptions);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const performanceSlice = createSlice({
  name: "performance",
  initialState: {
    performance: null,
    status: "idle",
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformance.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchPerformance.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.performance = action.payload;
        state.error = null;
      })
      .addCase(fetchPerformance.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default performanceSlice.reducer;
