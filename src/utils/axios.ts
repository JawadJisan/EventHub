import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
