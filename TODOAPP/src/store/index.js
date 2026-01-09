import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import productsReducer from "../slices/productsSlice";
import todosReducer from "../slices/todosSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    todos: todosReducer,
  },
});

export default store;