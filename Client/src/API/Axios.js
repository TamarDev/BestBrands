import axios from "axios";

// 1. Create a customized Axios instance with the server base URL.
// The URL comes from VITE_API_URL (for example, http://localhost:1234 in development);
// if it is not set, use the production Render server by default.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://bestbrands-8g7o.onrender.com",
});

// 2. Configure the request interceptor.
api.interceptors.request.use(
  (config) => {
    // Read the token from localStorage for every request.
    const token = localStorage.getItem("token");
    
    // Attach the token to the current request headers when one exists.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Handle an expired token by clearing the session and returning to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;