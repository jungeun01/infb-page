import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatas } from "../../../src/pages/API/firebase";

export const fetchBusiness = createAsyncThunk(
  "business/fetchBusiness",
  async ({ collectionName, queryOptions }, { rejectWithValue }) => {
    try {
      const data = await getDatas(collectionName, queryOptions);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const businessSlice = createSlice({
  name: "business",
  initialState: {
    business: null,
    status: "idle",
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusiness.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchBusiness.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.business = action.payload;
        state.error = null;
      })
      .addCase(fetchBusiness.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default businessSlice.reducer;
