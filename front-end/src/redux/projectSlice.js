import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    list: [],
    currentProject: null,
    loading: false,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setProjects(state, action) {
      state.list = action.payload;
    },
    addProject(state, action) {
      state.list.unshift(action.payload);
    },
    removeProject(state, action) {
      state.list = state.list.filter((p) => p._id !== action.payload);
    },
    setSingleProject(state, action) {
      state.currentProject = action.payload;
    },
    updateProjectInState(state, action) {
      const updatedProject = action.payload;

      const index = state.list.findIndex((p) => p._id === updatedProject._id);

      if (index !== -1) {
        state.list[index] = updatedProject;
      }

      if (
        state.currentProject &&
        state.currentProject._id === updatedProject._id
      ) {
        state.currentProject = updatedProject;
      }
    },
  },
});

export const {
  setLoading,
  setProjects,
  addProject,
  removeProject,
  setSingleProject,
  updateProjectInState,
} = projectSlice.actions;

export default projectSlice.reducer;
