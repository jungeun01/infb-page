import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "business",
  selectedImage: null,
  data: {
    business: [],
    private: [],
    partner: [],
  },
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSelectedImage: (state, action) => {
      state.selectedImage = action.payload;
    },
    addItem: (state, action) => {
      const { type } = action.payload;
      const newItem = {
        id: Date.now(),
        img: "",
        href: "",
        name: "",
      };
      state.data[type] = [newItem, ...state.data[type]];
    },
    deleteItem: (state, action) => {
      const { type, index } = action.payload;
      state.data[type] = state.data[type].filter((_, i) => i !== index);
    },
    updateItem: (state, action) => {
      const { type, index, field, value } = action.payload;
      state.data[type][index][field] = value;
    },
    setImageForItem: (state, action) => {
      const { type, index, imageName } = action.payload;
      state.data[type][index].img = imageName;
      state.selectedImage = null;
    },
    setInitialData: (state, action) => {
      state.data = action.payload || initialState.data;
    },
  },
});

export const {
  setActiveTab,
  setSelectedImage,
  addItem,
  deleteItem,
  updateItem,
  setImageForItem,
  setInitialData,
} = clientsSlice.actions;

export default clientsSlice.reducer;
