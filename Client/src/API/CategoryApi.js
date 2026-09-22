import api from "./Axios";
const route="/Category";

  // Get all categories.
  export const getAllCategories= async () => {
      const response = await api.get(`${route}/`);
      return response.data;
    };

  // Get a category by ID.
  export const getCategoryById = async (categoryId) => {
    
      const response = await api.get(`${route}/GetById/${categoryId}`);
      return response.data;
    };

  // Add a category (admin).
  export const addCategory = async (categoryData) => {
      const response = await api.post(`${route}/Add`, {name: categoryData.name,})
      return response.data;
    };

  // Update a category (admin).
  export const updateCategory = async (categoryId, categoryData) => {
   
      const response = await api.put(`${route}/Update/${categoryId}`, categoryData);
      return response.data;
    };

  // Delete a category (admin).
  export const deleteCategory = async (categoryId) => {
   
      const response = await api.delete(`${route}/Delete/${categoryId}` );
      return response.data;
    };
