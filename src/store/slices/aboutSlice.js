import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatas } from "../../../src/pages/API/firebase";

export const fetchAbout = createAsyncThunk(
  "about/fetchAbout",
  async ({ collectionName, queryOptions }, { rejectWithValue }) => {
    try {
      const data = await getDatas(collectionName, queryOptions);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const aboutSlice = createSlice({
  name: "about",
  initialState: {
    about: null,
    status: "idle",
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbout.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchAbout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.about = action.payload;
        state.error = null;
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default aboutSlice.reducer;
