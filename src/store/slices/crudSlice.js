import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDatas,
  addDatas,
  updateDatas,
  deleteDatas,
} from "../../pages/API/firebase";

// Async Thunks
export const fetchItems = createAsyncThunk(
  "crud/fetchItems",
  async ({ collectionName, queryOptions = {} }) => {
    try {
      const items = await getDatas(collectionName, queryOptions);
      return items;
    } catch (error) {
      throw error;
    }
  }
);

export const addItem = createAsyncThunk(
  "crud/addItem",
  async ({ collectionName, data }) => {
    try {
      const newItem = await addDatas(collectionName, data);
      return newItem;
    } catch (error) {
      throw error;
    }
  }
);

export const updateItem = createAsyncThunk(
  "crud/updateItem",
  async ({ collectionName, docId, data }) => {
    try {
      await updateDatas(collectionName, docId, data);
      return { docId, ...data };
    } catch (error) {
      throw error;
    }
  }
);

export const deleteItem = createAsyncThunk(
  "crud/deleteItem",
  async ({ collectionName, docId }) => {
    try {
      await deleteDatas(collectionName, docId);
      return docId;
    } catch (error) {
      throw error;
    }
  }
);

const crudSlice = createSlice({
  name: "crud",
  initialState: {
    items: {}, // collection별로 items를 저장
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Items
      .addCase(fetchItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items[action.meta.arg.collectionName] = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add Item
      .addCase(addItem.fulfilled, (state, action) => {
        const { collectionName } = action.meta.arg;
        if (!state.items[collectionName]) {
          state.items[collectionName] = [];
        }
        state.items[collectionName].push(action.payload);
      })

      // Update Item
      .addCase(updateItem.fulfilled, (state, action) => {
        const { collectionName } = action.meta.arg;
        const index = state.items[collectionName].findIndex(
          (item) => item.docId === action.payload.docId
        );
        if (index !== -1) {
          state.items[collectionName][index] = action.payload;
        }
      })

      // Delete Item
      .addCase(deleteItem.fulfilled, (state, action) => {
        const { collectionName } = action.meta.arg;
        state.items[collectionName] = state.items[collectionName].filter(
          (item) => item.docId !== action.meta.arg.docId
        );
      });
  },
});

export default crudSlice.reducer;
