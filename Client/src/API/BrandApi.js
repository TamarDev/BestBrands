import api from './Axios';

const route = "/Brands";

// ==========================
// Get a brand by name.
// ==========================

export const getBrandByName = async (brandName) => {
  const response = await api.get(
    `${route}/GetByName/${brandName}`
  );

  return response.data;
};


// ==========================
// Get all brands.
// ==========================

export const getAllBrands = async () => {
  const response = await api.get(`${route}/`);

  return response.data;
};


// ==========================
// Get a brand by ID.
// ==========================

export const getBrandById = async (brandId) => {
  const response = await api.get(
    `${route}/GetById/${brandId}`
  );

  return response.data;
};


// ==========================
// Add a brand.
// ==========================

export const addBrand = async (brandData) => {

  const formData = new FormData();

  formData.append("name", brandData.name);
  formData.append("description", brandData.description);
  formData.append("inventor", brandData.inventor);

  // Regular image.
  if (brandData.image) {
    formData.append("image", brandData.image);
  }

  // Brand page image.
  if (brandData.imagePage) {
    formData.append("imagePage", brandData.imagePage);
  }

  const response = await api.post(
    `${route}/Add`,
    formData
  );

  return response.data;
};


// ==========================
// Update a brand.
// ==========================

export const updateBrand = async (brandId, brandData) => {

  const formData = new FormData();

  formData.append("name", brandData.name);
  formData.append("description", brandData.description);
  formData.append("inventor", brandData.inventor);

  // Regular image.
  if (brandData.image instanceof File) {
    formData.append("image", brandData.image);
  }

  // Brand page image.
  if (brandData.imagePage instanceof File) {
    formData.append("imagePage", brandData.imagePage);
  }

  const response = await api.put(
    `${route}/Update/${brandId}`,
    formData
  );

  return response.data;
};


// ==========================
// Delete a brand.
// ==========================

export const deleteBrand = async (brandId) => {

  const response = await api.delete(
    `${route}/Delete/${brandId}`
  );

  return response.data;
};