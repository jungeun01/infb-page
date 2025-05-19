import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDatas,
  addDatas,
  updateDatas,
  deleteDatas,
} from "../../pages/API/firebase";

// 비동기 액션 생성
export const fetchCollection = createAsyncThunk(
  "collection/fetchCollection",
  async ({ collectionName }) => {
    // console.log("Fetching collection:", collectionName);
    const response = await getDatas(collectionName);
    // console.log("Fetched data:", response);
    return { collectionName, data: response };
  }
);

export const addCollection = createAsyncThunk(
  "collection/addCollection",
  async ({ collectionName, data }) => {
    const response = await addDatas(collectionName, data);
    return { collectionName, data: response };
  }
);

export const updateCollection = createAsyncThunk(
  "collection/updateCollection",
  async ({ collectionName, docId, data }) => {
    // console.log("Updating collection:", { collectionName, docId, data });
    const response = await updateDatas(collectionName, docId, data);
    return { collectionName, data: response };
  }
);

export const deleteCollection = createAsyncThunk(
  "collection/deleteCollection",
  async ({ collectionName, id }) => {
    await deleteDatas(collectionName, id);
    return { collectionName, id };
  }
);

const initialState = {
  collections: {
    basicInfo: null, // CEO 인사말은 basicInfo 컬렉션에 있음
    business: null,
    performance: null,
    talent: null,
  },
  status: {
    basicInfo: "idle",
    business: "idle",
    performance: "idle",
    talent: "idle",
  },
  error: {
    basicInfo: null,
    business: null,
    performance: null,
    talent: null,
  },
  isEditing: false, // 수정 모드 상태 추가
};

const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    clearError: (state, action) => {
      state.error[action.payload] = null;
    },
    setEditingMode: (state, action) => {
      state.isEditing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Collection
      .addCase(fetchCollection.pending, (state, action) => {
        const { collectionName } = action.meta.arg;
        state.status[collectionName] = "loading";
      })
      .addCase(fetchCollection.fulfilled, (state, action) => {
        const { collectionName, data } = action.payload;
        state.status[collectionName] = "succeeded";
        state.collections[collectionName] = data;
      })
      .addCase(fetchCollection.rejected, (state, action) => {
        const { collectionName } = action.meta.arg;
        state.status[collectionName] = "failed";
        state.error[collectionName] = action.error.message;
      })
      // Add Collection
      .addCase(addCollection.pending, (state, action) => {
        const { collectionName } = action.meta.arg;
        state.status[collectionName] = "loading";
      })
      .addCase(addCollection.fulfilled, (state, action) => {
        const { collectionName, data } = action.payload;
        state.status[collectionName] = "succeeded";
        state.collections[collectionName] = data;
      })
      .addCase(addCollection.rejected, (state, action) => {
        const { collectionName } = action.meta.arg;
        state.status[collectionName] = "failed";
        state.error[collectionName] = action.error.message;
      })
      // Update Collection
      .addCase(updateCollection.pending, (state, action) => {
        const { collectionName } = action.meta.arg;
        state.status[collectionName] = "loading";
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        const { collectionName, data } = action.payload;
        state.status[collectionName] = "succeeded";
        state.collections[collectionName] = data;
        state.isEditing = false; // 수정 완료 후 수정 모드 해제
      })
      .addCase(updateCollection.rejected, (state, action) => {
        const { collectionName } = action.meta.arg;
        state.status[collectionName] = "failed";
        state.error[collectionName] = action.error.message;
      })
      // Delete Collection
      .addCase(deleteCollection.pending, (state, action) => {
        const { collectionName } = action.meta.arg;
        state.status[collectionName] = "loading";
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        const { collectionName, id } = action.payload;
        state.status[collectionName] = "succeeded";
        // 삭제된 데이터 반영
        if (state.collections[collectionName]) {
          state.collections[collectionName] = state.collections[
            collectionName
          ].filter((item) => item.id !== id);
        }
      })
      .addCase(deleteCollection.rejected, (state, action) => {
        const { collectionName } = action.meta.arg;
        state.status[collectionName] = "failed";
        state.error[collectionName] = action.error.message;
      });
  },
});

export const { clearError, setEditingMode } = collectionSlice.actions;
export default collectionSlice.reducer;
