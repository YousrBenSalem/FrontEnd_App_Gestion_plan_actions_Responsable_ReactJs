import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./userSlice"
import storage from "redux-persist/lib/storage" ;
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";


//export  const store = configureStore({reducer: authSlice})
 const persistConfig = {
  key : "token",
  storage,
  whitelist: ["user","tokens"],

 }
 const persistreducer = persistReducer(persistConfig, authSlice);
 export const store = configureStore({reducer: {auth :persistreducer}});
 
 export let persistor = persistStore(store);