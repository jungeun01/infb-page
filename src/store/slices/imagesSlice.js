import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllImageFiles,
  fetchMultipleImages,
  uploadImage,
  deleteImage,
} from "../../pages/API/firebase";

// 특정 폴더의 이미지 URL들을 가져오는 비동기 액션
export const fetchFolderImages = createAsyncThunk(
  "images/fetchFolderImages",
  async (folder, { rejectWithValue }) => {
    try {
      const files = await getAllImageFiles(folder);
      if (files.length === 0) return {};

      const urls = await fetchMultipleImages(files.map((file) => file.path));
      return {
        folder,
        urls,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 이미지 업로드 액션
export const uploadImageFile = createAsyncThunk(
  "images/uploadImageFile",
  async ({ file, folder }, { rejectWithValue }) => {
    try {
      const downloadURL = await uploadImage(file, folder);
      return {
        folder,
        fileName: file.name,
        url: downloadURL,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 이미지 삭제 액션
export const deleteImageFile = createAsyncThunk(
  "images/deleteImageFile",
  async ({ folder, fileName }, { rejectWithValue }) => {
    try {
      await deleteImage(`${folder}/${fileName}`);
      return {
        folder,
        fileName,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 여러 이미지 업로드 액션
export const uploadMultipleImages = createAsyncThunk(
  "images/uploadMultipleImages",
  async ({ files, folder }, { dispatch, rejectWithValue }) => {
    try {
      const results = [];
      for (const file of files) {
        // 기존 uploadImageFile thunk 재활용
        const result = await dispatch(
          uploadImageFile({ file, folder })
        ).unwrap();
        results.push(result);
      }
      return {
        folder,
        files: results, // [{fileName, url, ...}, ...]
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const imagesSlice = createSlice({
  name: "images",
  initialState: {
    urls: {},
    status: "idle",
    error: null,
    uploadStatus: "idle",
    deleteStatus: "idle",
  },
  reducers: {
    clearImages: (state) => {
      state.urls = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // 이미지 목록 가져오기
      .addCase(fetchFolderImages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFolderImages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.urls = {
          ...state.urls,
          [action.payload.folder]: action.payload.urls,
        };
      })
      .addCase(fetchFolderImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // 이미지 업로드
      .addCase(uploadImageFile.pending, (state) => {
        state.uploadStatus = "loading";
      })
      .addCase(uploadImageFile.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        if (!state.urls[action.payload.folder]) {
          state.urls[action.payload.folder] = {};
        }
        state.urls[action.payload.folder][
          `${action.payload.folder}/${action.payload.fileName}`
        ] = action.payload.url;
      })
      .addCase(uploadImageFile.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.error = action.payload;
      })
      // 이미지 삭제
      .addCase(deleteImageFile.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteImageFile.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        if (state.urls[action.payload.folder]) {
          delete state.urls[action.payload.folder][
            `${action.payload.folder}/${action.payload.fileName}`
          ];
        }
      })
      .addCase(deleteImageFile.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload;
      })
      .addCase(uploadMultipleImages.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        if (!state.urls[action.payload.folder]) {
          state.urls[action.payload.folder] = {};
        }
        action.payload.files.forEach((fileObj) => {
          state.urls[action.payload.folder][
            `${action.payload.folder}/${fileObj.fileName}`
          ] = fileObj.url;
        });
      });
  },
});

export const { clearImages } = imagesSlice.actions;
export default imagesSlice.reducer;
