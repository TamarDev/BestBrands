import api from "./Axios";
const route="/User";

export const getAllUsers= async () => {
  const response = await api.get(`${route}/`);
  return response.data;
}; 

export const getUserById= async (userId) => {
  const response = await api.get(`${route}/GetById/${userId}`);
  return response.data;
};

// Remember to add a function that fetches a brand by name.

export const updateUser = async (userId, userData) => {
  const response = await api.patch(`${route}/Update/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`${route}/Delete/${userId}`);
  return response.data;
};