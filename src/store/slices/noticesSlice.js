// src/store/slices/noticesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDatas,
  addDatas,
  updateDatas,
  deleteDatas,
} from "../../pages/API/firebase";

// Timestamp를 직렬화 가능한 형태로 변환하는 함수
const serializeTimestamp = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

// 공지사항 데이터 직렬화 함수
const serializeNotice = (notice) => ({
  ...notice,
  createdAt: serializeTimestamp(notice.createdAt),
  updatedAt: serializeTimestamp(notice.updatedAt),
});

// 공지사항 가져오기
export const fetchNotices = createAsyncThunk(
  "notices/fetchNotices",
  async ({ collectionName, queryOptions }, { rejectWithValue }) => {
    try {
      const result = await getDatas(collectionName, queryOptions);
      return result.map(serializeNotice);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 공지사항 추가
export const addNotice = createAsyncThunk(
  "notices/addNotice",
  async ({ collectionName, data }, { rejectWithValue }) => {
    try {
      const newData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = await addDatas(collectionName, newData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 공지사항 수정
export const updateNotice = createAsyncThunk(
  "notices/updateNotice",
  async ({ collectionName, docId, data }, { rejectWithValue }) => {
    try {
      await updateDatas(collectionName, docId, data);
      return { docId, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 공지사항 삭제
export const deleteNotice = createAsyncThunk(
  "notices/deleteNotice",
  async ({ collectionName, docId }, { rejectWithValue }) => {
    try {
      const result = await deleteDatas(collectionName, docId);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const noticesSlice = createSlice({
  name: "notices",
  initialState: {
    notices: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.notices = action.payload;
        state.error = null;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addNotice.fulfilled, (state, action) => {
        state.notices.push(action.payload);
      })
      .addCase(updateNotice.fulfilled, (state, action) => {
        const { docId, ...data } = action.payload;
        const notice = state.notices.find((n) => n.docId === docId);
        if (notice) {
          Object.assign(notice, data);
        }
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.notices = state.notices.filter(
          (notice) => notice.docId !== action.payload
        );
      });
  },
});

export default noticesSlice.reducer;
