import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Services/apiConnector";

// Fetch all tasks for a project
export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (projectId) => {
    const res = await api.get(`/task?projectId=${projectId}`);
    return res.data.tasks;
  },
);

// Create a new task
export const createTask = createAsyncThunk(
  "task/createTask",
  async (taskData) => {
    const res = await api.post("/task/create", taskData);
    return res.data.task;
  },
);

// Update a task
export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ id, updateData }) => {
    const res = await api.put(`/task/update/${id}`, updateData);
    return res.data.task;
  },
);

// Delete a task
export const deleteTask = createAsyncThunk("task/deleteTask", async (id) => {
  await api.delete(`/task/delete/${id}`);
  return id;
});

const taskSlice = createSlice({
  name: "task",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.list = state.list.map((t) =>
          t._id === action.payload._id ? action.payload : t,
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
