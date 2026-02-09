import api from "../apiConnector";
import {
  setLoading,
  setAllTeams,
  setTeam,
  setMembers,
  addMemberToState,
  removeMemberFromState,
} from "../../redux/teamSlice";

// Create Team
export const createTeam = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await api.post("/team/create", data);
    dispatch(setTeam(res.data.team));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Get all teams of a project
export const fetchTeamsOfProject = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await api.get(`/team/project/${id}`);
    dispatch(setAllTeams(res.data.teams));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Get Team Details
export const fetchTeamDetails = (teamId) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const res = await api.get(`/team/${teamId}`);
    dispatch(setTeam(res.data.team));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Update Team
export const updateTeam = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await api.put(`/team/${id}`, data);
    dispatch(setTeam(res.data.team));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Delete Team
export const deleteTeam = (projectId, teamId) => async (dispatch) => {
  try {
    await api.delete(`/team/${teamId}`);

    // Refresh teams of that project
    dispatch(fetchTeamsOfProject(projectId));
  } catch (error) {
    console.error(error);
  }
};

// Get Team Users
export const fetchTeamUsers = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await api.get("/team/users/all");
    dispatch(setMembers(res.data.users));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Add Member
export const addMember = (teamId, userId) => async (dispatch) => {
  try {
    const res = await api.post(`/team/${teamId}/members`, { userId });
    dispatch(addMemberToState({ _id: userId }));
  } catch (error) {
    console.error(error);
  }
};

// Remove Member
export const removeMember = (teamId, memberId) => async (dispatch) => {
  try {
    await api.delete(`/team/${teamId}/members/${memberId}`);
    dispatch(removeMemberFromState(memberId));
  } catch (error) {
    console.error(error);
  }
};
