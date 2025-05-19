import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatas } from "../../pages/API/firebase";

export const fetchTalent = createAsyncThunk(
  "talent/fetchTalent",
  async ({ collectionName, queryOptions = {} }) => {
    const data = await getDatas(collectionName, queryOptions);
    return data;
  }
);

const talentSlice = createSlice({
  name: "talent",
  initialState: {
    talent: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTalent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTalent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.talent = action.payload;
      })
      .addCase(fetchTalent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const talentReducer = talentSlice.reducer;
