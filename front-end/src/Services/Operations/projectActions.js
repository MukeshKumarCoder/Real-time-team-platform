import {
  setLoading,
  setProjects,
  addProject,
  removeProject,
  updateProjectInState,
  setSingleProject,
} from "../../redux/projectSlice";
import api from "../../Services/apiConnector";

export const fetchProjects = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await api.get("/project");
     dispatch(setProjects(res.data.data));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchSingleProject = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await api.get(`/project/${id}`);
    dispatch(setSingleProject(res.data.project));

  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const createProject = (data) => async (dispatch) => {
  try {
    const res = await api.post("/project/create", data);
    dispatch(addProject(res.data));
  } catch (error) {
    console.error(error);
  }
};

export const updateProject = (id, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const res = await api.put(`/project/update/${id}`, data);

    dispatch(updateProjectInState(res.data.project));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteProject = (id) => async (dispatch) => {
  try {
    await api.delete(`/project/delete/${id}`);
    dispatch(removeProject(id));
  } catch (error) {
    console.error(error);
  }
};
