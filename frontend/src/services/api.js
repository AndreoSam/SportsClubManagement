import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

// 🔐 INTERCEPTOR (ATTACH TOKEN AUTOMATICALLY)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// 🔴 ERROR INTERCEPTOR FOR BETTER DEBUGGING
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("API request timeout:", process.env.NEXT_PUBLIC_API_URL);
    } else if (!error.response) {
      console.error("API connection failed:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
