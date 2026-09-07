import api from "./Axios";
const route="/Orders";

export const getAllOrders= async () => {
  const response = await api.get(`${route}/`);
  return response.data;
};

export const getOrderById= async (orderId) => {
  const response = await api.get(`${route}/GetById/${orderId}`);
  return response.data;
};

export const getOrdersByUser= async () => {
  const response = await api.get(`${route}/MyOrders`);
  return response.data;
};

export const addOrder = async (orderData) => {
  const response = await api.post(`${route}/Add`, orderData);
  return response.data;
};

export const updateOrder = async (orderId, orderData) => {
  const response = await api.put(`${route}/Update/${orderId}`, orderData);
  return response.data;
};

export const deleteOrder = async (orderId) => {
  const response = await api.delete(`${route}/Delete/${orderId}`);
  return response.data;
};