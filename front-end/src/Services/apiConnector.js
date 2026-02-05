import axios from "axios";

const api = axios.create({
  baseURL: "https://real-time-team-platform-3jcov8xe3.vercel.app/api",
  withCredentials: true,
});

export default api;
