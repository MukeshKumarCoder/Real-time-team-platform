import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",
  initialState: {
    team: [],
    currentTeam: null,
    members: [],
    loading: false,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },

    setAllTeams(state, action) {
      state.team = action.payload;
    },
    setTeam(state, action) {
      state.currentTeam = action.payload;
    },
    clearTeam(state) {
      state.currentTeam = null;
      state.members = [];
    },

    setMembers(state, action) {
      state.members = action.payload;
    },

    addMemberToState(state, action) {
      state.members.push(action.payload);
    },

    removeMemberFromState(state, action) {
      state.members = state.members.filter((m) => m._id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setAllTeams,
  setTeam,
  clearTeam,
  setMembers,
  addMemberToState,
  removeMemberFromState,
} = teamSlice.actions;

export default teamSlice.reducer;
