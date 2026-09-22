
import api from "./Axios";
const route="/Product";

  // Get all products.
  export const getAllProducts= async () => {
   
      const response = await api.get(`${route}/`);
      return response.data;
  };

  // Get a product by ID.
  export const getProductById= async (productId) => {
   
      const response = await api.get(`${route}/GetById/${productId}`);
      return response.data;
    };
 

  export const getProductsByBrand =async (brandName) => {
     
        const response = await api.get(`${route}/GetByBrand/${brandName}`);
        return response.data;
   };

  // Add a product (admin).
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

  // Update a product (admin).
  export const updateProduct = async (productId, productData) => {
    const formData = new FormData();

    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("brand", productData.brand);
    formData.append("category", productData.category);
    formData.append("color", productData.color);
    formData.append("sizes", JSON.stringify(productData.sizes));

    // image can be a new file selected from the computer,
    // or a string containing the existing image URL; send either value to preserve it.
    if (productData.image) {
      formData.append("image", productData.image);
    }

    const response = await api.put(`${route}/Update/${productId}`, formData);
    return response.data;
  };

  // Delete a product (admin).
  export const deleteProduct= async (productId) => {
   
      const response = await api.delete(`${route}/Delete/${productId}`);
      return response.data;
  };

