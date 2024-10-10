import reducer from "./reducer";
import thunk from "redux-thunk";
import {  configureStore } from "@reduxjs/toolkit";

const middleware = [thunk]; // Define an array of middleware

const store = configureStore({
  reducer: reducer,
  middleware: middleware, // Pass the middleware array
});

export default store;

