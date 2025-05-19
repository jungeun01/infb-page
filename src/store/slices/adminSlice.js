import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDatas,
  addDatas,
  updateDatas,
  deleteDatas,
} from "../../pages/API/firebase";

// 데이터 조회 액션
export const fetchCollectionData = createAsyncThunk(
  "admin/fetchCollectionData",
  async (collectionName) => {
    try {
      const response = await getDatas(collectionName);
      // console.log("Fetched data:", response);
      return { collectionName, data: response };
    } catch (error) {
      throw error;
    }
  }
);

// 데이터 추가 액션
export const addCollectionData = createAsyncThunk(
  "admin/addCollectionData",
  async ({ collectionName, newData }) => {
    try {
      const response = await addDatas(collectionName, newData);
      return { collectionName, data: response };
    } catch (error) {
      throw error;
    }
  }
);

// 데이터 업데이트 액션
export const updateCollectionData = createAsyncThunk(
  "admin/updateCollectionData",
  async ({ collectionName, docId, updateData }) => {
    try {
      await updateDatas(collectionName, docId, updateData);
      return { collectionName, docId, updateData };
    } catch (error) {
      throw error;
    }
  }
);

// 데이터 삭제 액션
export const deleteCollectionData = createAsyncThunk(
  "admin/deleteCollectionData",
  async ({ collectionName, docId }) => {
    try {
      await deleteDatas(collectionName, docId);
      return { collectionName, docId };
    } catch (error) {
      throw error;
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    data: null,
    status: "idle",
    error: null,
    currentCollection: null,
    updateStatus: "idle",
  },
  reducers: {
    setCurrentCollection: (state, action) => {
      state.currentCollection = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch 상태 처리
      .addCase(fetchCollectionData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCollectionData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCollectionData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add 상태 처리
      .addCase(addCollectionData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCollectionData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        // 새로운 데이터를 state에 추가
        if (state.data) {
          state.data = [...state.data, action.payload.data];
        } else {
          state.data = [action.payload.data];
        }
      })
      .addCase(addCollectionData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Update 상태 처리
      .addCase(updateCollectionData.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateCollectionData.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.error = null;
        // 업데이트된 데이터를 state에 반영
        if (state.data) {
          state.data = state.data.map((item) =>
            item.id === action.payload.docId
              ? { ...item, ...action.payload.updateData }
              : item
          );
        }
      })
      .addCase(updateCollectionData.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.error.message;
      })
      // Delete 상태 처리
      .addCase(deleteCollectionData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCollectionData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        // 삭제된 데이터를 state에서 제거
        if (state.data) {
          state.data = state.data.filter(
            (item) => item.id !== action.payload.docId
          );
        }
      })
      .addCase(deleteCollectionData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setCurrentCollection } = adminSlice.actions;
export default adminSlice.reducer;
