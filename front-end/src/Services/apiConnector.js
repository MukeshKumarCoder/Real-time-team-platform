import axios from "axios";

const api = axios.create({
  baseURL: "https://real-time-team-platform-6zz69kysf.vercel.app/api",
  withCredentials: true,
});

export default api;
