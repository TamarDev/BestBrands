
// import api from './Axios'
// const route="/Brands";
//   // קבל את כל המותגים

//   //צריך לעשות עוד פונקציה שמקבלת את המותג עפי שם
//   export const getBrandByName=async (brandName) => {
//       const response = await api.get(`${route}/GetByName/${brandName}`)
//       return response.data;
//   };


//   export const getAllBrands = async () => {
//       const response = await api.get(`${route}/`);
//       return response.data;
//   };

//   // קבל מותג ספציפי לפי ID
//   export const getBrandById=async (brandId) => {
//       const response = await api.get(`${route}/GetById/${brandId}`)
//       return response.data;
//   };

//   // צור מותג חדש (צריך token של admin)
// //   export const addBrand = async (brandData) => {
   
// //       const response = await api.post(`${route}/Add`, 
// //         {
// //           name: brandData.name,
// //           description: brandData.description,
// //           image: brandData.image,
// //           inventor: brandData.inventor
// //         }
// //       )
// //       return response.data;
// // };


// export const addBrand = async (brandData) => {
//   const formData = new FormData();

//   formData.append("name", brandData.name);
//   formData.append("description", brandData.description);
//   formData.append("inventor", brandData.inventor);

//   if (brandData.image) {
//     formData.append("image", brandData.image);
//   }

//   const response = await api.post(`${route}/Add`, formData);

//   return response.data;
// };

//   // עדכן מותג (צריך token של admin)
//   export const updateBrand=async (brandId, brandData) => {
//       const response = await api.put(`${route}/Update/${brandId}`,brandData)
//       return response.data;
//     };


//   // מחק מותג (צריך token של admin)
//   export const deleteBrand=async (brandId) => {
//       const response = await api.delete(`${route}/Delete/${brandId}`)
//       return response.data
//     } ;
 
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