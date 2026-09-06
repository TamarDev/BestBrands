
// import api from "./Axios";

// const API_URL = "http://localhost:1234/ShoppingCart"; // תשני אם הפורט או הראוט שונים

// // ==========================================
// //  פונקציות משתמש (USER SHOPPING CART)
// // ==========================================

// // 1. קבלת העגלה של המשתמש המחובר (getMyCart)
// export const getMyCart = async () => {
//   const response = await api.get(`${API_URL}/myCart/get`); 
//   return response.data;
// };

// // 2. הוספת מוצר לעגלה (addItemToCart)
// export const addToCart = async (productId, quantity = 1) => {
//   const response = await api.post(`${API_URL}/add`, { productId, quantity });
//   return response.data;
// };

// // 3. עדכון כמות של מוצר קיים (updateItemQuantity)
// export const updateItemQuantity = async (productId, quantity) => {
//   const response = await api.put(`${API_URL}/update`, { productId, quantity });
//   return response.data;
// };

// // 4. מחיקת מוצר לחלוטין מהעגלה (removeItemFromCart)
// export const removeItemFromCart = async (productId) => {
//   const response = await api.delete(`${API_URL}/remove`, {
//     data: { productId }
//   });
//   return response.data;
// };

// // 5. ריקון כל העגלה (clearCart)
// export const clearCartServer = async () => {
//   const response = await api.delete(`${API_URL}/clear`);
//   return response.data;
// };


// // ==========================================
// //  פונקציות מנהל (ADMIN FUNCTIONS)
// // ==========================================

// // 6. קבלת כל עגלות הקניות במערכת (getAllShoppingCart)
// export const getAllCartsAdmin = async () => {
//   const response = await api.get(`${API_URL}/all`); // ודאי את הראוט בשרת (למשל /all)
//   return response.data;
// };

// // 7. קבלת עגלה ספציפית לפי ה-ID שלה (getShoppingCartById)
// export const getCartByIdAdmin = async (cartId) => {
//   const response = await api.get(`${API_URL}/${cartId}`);
//   return response.data;
// };

// // 8. מחיקת עגלה של משתמש כלשהו מהמערכת (deleteShoppingCart)
// export const deleteCartAdmin = async (cartId) => {
//   const response = await api.delete(`${API_URL}/${cartId}`);
//   return response.data;
// };
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