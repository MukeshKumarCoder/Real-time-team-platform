import api from "../../Services/apiConnector";
import {
  setLoading,
  setTasks,
  addTask,
  updateTaskStatus,
  removeTask,
} from "../../redux/taskSlice";

// Fetch tasks
export const fetchTasks = (projectId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await api.get(`/task?projectId=${projectId}`);
    dispatch(setTasks(res.data.tasks));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setLoading(false));
  }
};

// Create task
export const createTask = (taskData) => async (dispatch) => {
  try {
    const res = await api.post("/task/create", taskData);
    dispatch(addTask(res.data.task));
  } catch (error) {
    console.error(error);
  }
};

// Update task
export const updateTask = (id, updateData) => async (dispatch) => {
  try {
    const res = await api.put(`/task/${id}/status`, updateData);
    dispatch(updateTaskStatus(res.data.task));
  } catch (error) {
    console.error(error);
  }
};

// Delete task
export const deleteTask = (id) => async (dispatch) => {
  try {
    await api.delete(`/task/delete/${id}`);
    dispatch(removeTask(id));
  } catch (error) {
    console.error(error);
  }
};
