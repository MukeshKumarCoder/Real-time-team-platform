import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Services/apiConnector";

export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async () => {
    const res = await api.get("/projects");
    return res.data.data;
  },
);

export const fetchSingleProject = createAsyncThunk(
  "project/fetchSingleProject",
  async (id) => {
    const res = await api.get(`/projects/single/${id}`);
    return res.data.project;
  },
);

export const createProject = createAsyncThunk(
  "project/createProject",
  async (data) => {
    const res = await api.post("/projects/create", data);
    return res.data;
  },
);

export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (id) => {
    await api.delete(`/projects/delete/${id}`);
    return id;
  },
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    list: [],
    currentProject: null,
    loading: false,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      })
      .addCase(fetchSingleProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleProject.fulfilled, (state, action) => {
        state.currentProject = action.payload;
        state.loading = false;
      });
  },
});

export default projectSlice.reducer;
