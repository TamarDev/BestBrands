import api from "./Axios";

// משאירים רק את החלק היחסי של הראוט, ה-baseURL כבר בפנים
const route = "/ShoppingCart"; 

// ==========================================
//  פונקציות משתמש (USER SHOPPING CART)
// ==========================================

export const getMyCart = async () => {
  const response = await api.get(`${route}/get`); 
  return response.data;
};

export const addToCart = async (productId, quantity = 1, size) => {
  const response = await api.post(`${route}/addItem`, { productId, quantity, size });
  return response.data;
};

export const updateItemQuantity = async (productId, quantity, size) => {
  const response = await api.put(`${route}/updateItem`, { productId, quantity, size });
  return response.data;
};

export const removeItemFromCart = async (productId, size) => {
  const response = await api.delete(`${route}/removeItem`, {
    data: { productId, size }
  });
  return response.data;
};

export const clearCartServer = async () => {
  const response = await api.delete(`${route}/clear`);
  return response.data;
};

// ==========================================
//  פונקציות מנהל (ADMIN FUNCTIONS)
// ==========================================

export const getAllCartsAdmin = async () => {
  const response = await api.get(`${route}/`);
  return response.data;
};

export const getCartByIdAdmin = async (cartId) => {
  const response = await api.get(`${route}/GetById/${cartId}`);
  return response.data;
};

export const deleteCartAdmin = async (cartId) => {
  const response = await api.delete(`${route}/Delete/${cartId}`);
  return response.data;
};