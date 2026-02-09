import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "task",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setTasks(state, action) {
      state.list = action.payload;
    },
    addTask(state, action) {
      state.list.unshift(action.payload);
    },
    updateTaskStatus(state, action) {
      const updatedTask = action.payload;

      state.list = state.list.map((t) =>
        t._id === updatedTask._id ? updatedTask : t,
      );
    },
    removeTask(state, action) {
      state.list = state.list.filter((t) => t._id !== action.payload);
    },
  },
});

export const { setLoading, setTasks, addTask, updateTaskStatus, removeTask } =
  taskSlice.actions;

export default taskSlice.reducer;
