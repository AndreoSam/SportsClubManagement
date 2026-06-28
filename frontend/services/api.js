import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://sportsclubmanagement.onrender.com/api",
  timeout: 30000,
});

export default api;
