import axios from "axios";

// Base URL - update this to match your backend URL
const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  // Register/login user with Web3Auth data
  authenticate: async (userData) => {
    try {
      const response = await apiClient.post("/auth", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error connecting to server" };
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/auth/user");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error fetching user data" };
    }
  },
};
