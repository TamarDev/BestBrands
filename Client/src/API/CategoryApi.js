import api from "./Axios";
const route="/Category";

  // קבלת כל הקטגוריות
  export const getAllCategories= async () => {
      const response = await api.get(`${route}/`);
      return response.data;
    };

  // קבלת קטגוריה לפי מזהה
  export const getCategoryById = async (categoryId) => {
    
      const response = await api.get(`${route}/GetById/${categoryId}`);
      return response.data;
    };

  // הוספת קטגוריה (Admin)
  export const addCategory = async (categoryData) => {
      const response = await api.post(`${route}/Add`, {name: categoryData.name,})
      return response.data;
    };

  // עדכון קטגוריה (Admin)
  export const updateCategory = async (categoryId, categoryData) => {
   
      const response = await api.put(`${route}/Update/${categoryId}`, categoryData);
      return response.data;
    };

  // מחיקת קטגוריה (Admin)
  export const deleteCategory = async (categoryId) => {
   
      const response = await api.delete(`${route}/Delete/${categoryId}` );
      return response.data;
    };
