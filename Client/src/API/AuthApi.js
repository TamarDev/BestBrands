
import api from "./Axios"; // שימוש ב-Instance המרכזי

export const login = async (user) => {
  const response = await api.post("/Auth/login", user);
  return response.data;
};

export const register = async (user) => {
  const response = await api.post("/Auth/register", user);
  return response.data;
};

export const googleAuth = async (credential, mode) => {
  const response = await api.post("/Auth/google", { credential, mode });
  return response.data;
};

export const setPassword = async (password) => {
  const response = await api.post("/Auth/set-password", { password });
  return response.data;
};

//בשביל שחזור המשתמש בעת ריענון
export const getCurrentUser = async () => {
  const response = await api.get("/Auth/me");
  return response.data;
};

