import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatas } from "../../../src/pages/API/firebase";

export const fetchCertifications = createAsyncThunk(
  "certifications/fetchCertifications",
  async ({ collectionName, queryOptions }, { rejectWithValue }) => {
    try {
      const data = await getDatas(collectionName, queryOptions);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const certificationsSlice = createSlice({
  name: "certifications",
  initialState: {
    certifications: null,
    status: "idle",
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertifications.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchCertifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.certifications = action.payload;
        state.error = null;
      })
      .addCase(fetchCertifications.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default certificationsSlice.reducer;
