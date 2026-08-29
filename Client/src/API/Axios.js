import axios from "axios";

// 1. יצירת אובייקט Axios מותאם אישית עם כתובת הבסיס של השרת
const api = axios.create({
  baseURL:"https://bestbrands-8g7o.onrender.com", // 
});

// 2. הגדרת ה-Interceptor (המיירט)
api.interceptors.request.use(
  (config) => {
    // שליפת הטוקן מ-localStorage בכל קריאה מחדש
    const token = localStorage.getItem("token");
    
    // אם קיים טוקן, נדביק אותו ל-Headers של הבקשה הנוכחית
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