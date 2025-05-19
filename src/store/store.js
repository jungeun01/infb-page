import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postsSlice";
import noticesReducer from "./slices/noticesSlice";
import aboutReducer from "./slices/aboutSlice";
import basicInfoReducer from "./slices/basicInfoSlice";
import businessReducer from "./slices/businessSlice";
import certificationsReducer from "./slices/certificationsSlice";
import historyReducer from "./slices/historySlice";
import performanceReducer from "./slices/performanceSlice";
import productsReducer from "./slices/productsSlice";
import benefitsReducer from "./slices/benefitsSlice";
import { talentReducer } from "./slices/talentSlice";
import adminReducer from "./slices/adminSlice";
import collectionReducer from "./slices/collectionSlice";
import chartReducer from "./slices/chartSlice";
import imagesReducer from "./slices/imagesSlice";
import clientsReducer from "./slices/clientsSlice";
import crudReducer from "./slices/crudSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    notices: noticesReducer,
    about: aboutReducer,
    basicInfo: basicInfoReducer,
    business: businessReducer,
    certifications: certificationsReducer,
    history: historyReducer,
    performance: performanceReducer,
    products: productsReducer,
    benefits: benefitsReducer,
    talent: talentReducer,
    admin: adminReducer,
    collection: collectionReducer,
    chart: chartReducer,
    images: imagesReducer,
    clients: clientsReducer,
    crud: crudReducer,
  },
});

export default store;
