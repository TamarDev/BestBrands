
import api from "./Axios";
const route="/Product";

  // קבלת כל המוצרים
  export const getAllProducts= async () => {
   
      const response = await api.get(`${route}/`);
      return response.data;
  };

  // קבלת מוצר לפי ID
  export const getProductById= async (productId) => {
   
      const response = await api.get(`${route}/GetById/${productId}`);
      return response.data;
    };
 

  export const getProductsByBrand =async (brandName) => {
     
        const response = await api.get(`${route}/GetByBrand/${brandName}`);
        return response.data;
   };

  // הוספת מוצר (Admin)
//   export const addProduct = async (productData) => {
   
//       const response = await api.post(`${route}/Add`, productData);
//       return response.data;
//   };

export const addProduct = async (productData) => {
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("brand", productData.brand);
  formData.append("category", productData.category);
  formData.append("color", productData.color);
  formData.append("sizes", JSON.stringify(productData.sizes));

  if (productData.image) {
    formData.append("image", productData.image);
  }

  const response = await api.post(`${route}/Add`, formData);

  return response.data;
};

  // עדכון מוצר (Admin)
  export const updateProduct = async (productId, productData) => {
    const formData = new FormData();

    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("brand", productData.brand);
    formData.append("category", productData.category);
    formData.append("color", productData.color);
    formData.append("sizes", JSON.stringify(productData.sizes));

    // image יכול להיות קובץ חדש (File) שנבחר מהמחשב,
    // או מחרוזת עם הקישור לתמונה הקיימת – בשני המקרים שולחים אותו כדי לשמר את הערך
    if (productData.image) {
      formData.append("image", productData.image);
    }

    const response = await api.put(`${route}/Update/${productId}`, formData);
    return response.data;
  };

  // מחיקת מוצר (Admin)
  export const deleteProduct= async (productId) => {
   
      const response = await api.delete(`${route}/Delete/${productId}`);
      return response.data;
  };

