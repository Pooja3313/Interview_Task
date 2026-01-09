import { createSlice } from "@reduxjs/toolkit";

const persisted = JSON.parse(localStorage.getItem("todos_v1") || "null");
const initialState = {
  items: persisted || [
    // example
    // { id: 1, title: "Sample todo", done: false }
  ],
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo(state, action) {
      state.items.push(action.payload);
      localStorage.setItem("todos_v1", JSON.stringify(state.items));
    },
    updateTodo(state, action) {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      localStorage.setItem("todos_v1", JSON.stringify(state.items));
    },
    deleteTodo(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload);
      localStorage.setItem("todos_v1", JSON.stringify(state.items));
    },
    setTodos(state, action) {
      state.items = action.payload;
      localStorage.setItem("todos_v1", JSON.stringify(state.items));
    },
  },
});

export const { addTodo, updateTodo, deleteTodo, setTodos } = todosSlice.actions;
export default todosSlice.reducer;