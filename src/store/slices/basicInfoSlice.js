import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatas } from "../../../src/pages/API/firebase";

export const fetchBasicInfo = createAsyncThunk(
  "basicInfo/fetchBasicInfo",
  async ({ collectionName, queryOptions }, { rejectWithValue }) => {
    try {
      const data = await getDatas(collectionName, queryOptions);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const basicInfoSlice = createSlice({
  name: "basicInfo",
  initialState: {
    basicInfo: null,
    status: "idle",
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBasicInfo.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchBasicInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.basicInfo = action.payload;
        state.error = null;
      })
      .addCase(fetchBasicInfo.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default basicInfoSlice.reducer;
