import axios from "axios";

// 1. יצירת אובייקט Axios מותאם אישית עם כתובת הבסיס של השרת.
// הכתובת נלקחת מ-VITE_API_URL (למשל http://localhost:1234 בפיתוח);
// אם לא הוגדר — משתמשים בשרת הפרודקשן ב-Render כברירת מחדל.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://bestbrands-8g7o.onrender.com",
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