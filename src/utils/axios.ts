// import axios from "axios";
// import { useAuth } from "@/contexts/AuthContext";

// // Create axios instance
// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// // Add request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";
import { toast } from "sonner";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Inject bearer token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Catch  “Token is not valid” on *any* response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.msg;
    if (msg === "Token is not valid") {
      // 1) Clear local auth state
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 2) Show the user a quick notice
      toast.error("Your session has expired. Please log in again.");

      // 3) Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
