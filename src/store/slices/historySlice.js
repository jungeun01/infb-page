import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatas } from "../../../src/pages/API/firebase";

export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async ({ collectionName, queryOptions }, { rejectWithValue }) => {
    try {
      const data = await getDatas(collectionName, queryOptions);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: {
    history: null,
    status: "idle",
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.history = action.payload;
        state.error = null;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default historySlice.reducer;
