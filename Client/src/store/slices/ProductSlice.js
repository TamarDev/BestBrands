import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProducts,addProduct,deleteProduct,updateProduct,getProductById,getProductsByBrand } from "../../API/ProductsApi";

// פונקציה גנרית לתפיסת שגיאות נקייה
const handleThunkError = (err, thunkAPI) => {
  return thunkAPI.rejectWithValue(
    err.response?.data?.message || err.response?.data?.error || err.message
  );
};

// =======================
// GET ALL
// =======================
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await getAllProducts();
    } catch (err) {
      return handleThunkError(err, thunkAPI);
    }
  }
);

// =======================
// GET BY ID
// =======================
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, thunkAPI) => {
    try {
      return await getProductById(id);
    } catch (err) {
      return handleThunkError(err, thunkAPI);
    }
  }
);

export const fetchProductByBrand = createAsyncThunk(
  "products/fetchByBrand",
  async (brand, thunkAPI) => {
    try {
      return await getProductsByBrand(brand);
    } catch (err) {
      return handleThunkError(err, thunkAPI);
    }
  }
);

// =======================
// ADD PRODUCT
// =======================
export const addProductThunk = createAsyncThunk(
  "products/add",
  async (productData, thunkAPI) => {
    try {
      return await addProduct(productData);
    } catch (err) {
      return handleThunkError(err, thunkAPI);
    }
  }
);

// =======================
// UPDATE PRODUCT
// =======================
export const updateProductThunk = createAsyncThunk(
  "products/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateProduct(id, data);
    } catch (err) {
      return handleThunkError(err, thunkAPI);
    }
  }
);

// =======================
// DELETE PRODUCT
// =======================
export const deleteProductThunk = createAsyncThunk(
  "products/delete",
  async (id, thunkAPI) => {
    try {
      await deleteProduct(id);
      return id; // מחזירים את ה-ID כדי לסנן אותו מה-state ברמת ה-reducer
    } catch (err) {
      return handleThunkError(err, thunkAPI);
    }
  }
);

// =======================
// STATE & SLICE
// =======================
const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== GET ALL =====
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET BY ID =====
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET BY BRAND =====
      .addCase(fetchProductByBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.products = [];
      })
      .addCase(fetchProductByBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // דורס את המערך הקיים במוצרים של המותג הספציפי
      })
      .addCase(fetchProductByBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== ADD =====
      .addCase(addProductThunk.fulfilled, (state, action) => {
        const newProduct = action.payload.product || action.payload;
        state.error = null;
        state.products.push(newProduct);
      })
      .addCase(addProductThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ===== UPDATE =====
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (p) => (p._id || p.id) === (updatedProduct._id || updatedProduct.id)
        );
        state.error = null;
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ===== DELETE =====
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.error = null;
        state.products = state.products.filter(
          (p) => (p._id || p.id) !== deletedId
        );
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;