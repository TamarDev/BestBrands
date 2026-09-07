import api from './Axios';

const route = "/Brands";

// ==========================
// קבל מותג לפי שם
// ==========================

export const getBrandByName = async (brandName) => {
  const response = await api.get(
    `${route}/GetByName/${brandName}`
  );

  return response.data;
};


// ==========================
// קבל את כל המותגים
// ==========================

export const getAllBrands = async () => {
  const response = await api.get(`${route}/`);

  return response.data;
};


// ==========================
// קבל מותג לפי ID
// ==========================

export const getBrandById = async (brandId) => {
  const response = await api.get(
    `${route}/GetById/${brandId}`
  );

  return response.data;
};


// ==========================
// הוספת מותג
// ==========================

export const addBrand = async (brandData) => {

  const formData = new FormData();

  formData.append("name", brandData.name);
  formData.append("description", brandData.description);
  formData.append("inventor", brandData.inventor);

  // תמונה רגילה
  if (brandData.image) {
    formData.append("image", brandData.image);
  }

  // תמונת דף המותג
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
// עדכון מותג
// ==========================

export const updateBrand = async (brandId, brandData) => {

  const formData = new FormData();

  formData.append("name", brandData.name);
  formData.append("description", brandData.description);
  formData.append("inventor", brandData.inventor);

  // תמונה רגילה
  if (brandData.image instanceof File) {
    formData.append("image", brandData.image);
  }

  // תמונת דף המותג
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
// מחיקת מותג
// ==========================

export const deleteBrand = async (brandId) => {

  const response = await api.delete(
    `${route}/Delete/${brandId}`
  );

  return response.data;
};