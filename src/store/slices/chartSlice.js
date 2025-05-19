import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDatas } from "../../pages/API/firebase";

// 비동기 액션: chart 데이터 불러오기 (queryOptions 지원)
export const fetchChartData = createAsyncThunk(
  "chart/fetchChartData",
  async ({ collectionName, queryOptions }, { rejectWithValue }) => {
    try {
      const data = await getDatas(collectionName, queryOptions);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chartSlice = createSlice({
  name: "chart",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChartData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchChartData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data =
          action.payload[0] && action.payload[0].chart
            ? action.payload[0].chart
            : [];
      })
      .addCase(fetchChartData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default chartSlice.reducer;
