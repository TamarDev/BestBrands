import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// 1. The regular axios import was removed because it is no longer needed here.

// 2. Import the API functions.
import { 
  getAllBrands, 
  getBrandById, 
  getBrandByName,
  addBrand as addBrandToServer, // נתנו לו שם זמני כדי שלא יתנגש עם ה-Thunk
  updateBrand as updateBrandOnServer, 
  deleteBrand as deleteBrandFromServer 
} from '../../API/BrandApi';

// --- Asynchronous actions (thunks) ---

// Get all brands.
export const fetchBrands = createAsyncThunk('brands/fetchBrands', async (_, thunkAPI) => {
  try {
    // Call the API function directly; it already knows the URL and adds the token.
    const data = await getAllBrands(); 
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "שגיאה בטעינת המותגים");
  }

});


export const fetchBrandById = createAsyncThunk(
  'brands/fetchBrandById',
  async (brandId, thunkAPI) => {
    try {
      const data = await getBrandById(brandId);
      return data;
    } 
    catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "שגיאה בטעינת המותג"
      );
    }
  }
);

export const fetchBrandByName = createAsyncThunk(
  'brands/fetchBrandByName',
  async (brandName, thunkAPI) => {
    try {
      const data = await getBrandByName(brandName);
      return data;
    } 
    catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "שגיאה בטעינת המותג"
      );
    }
  }
);

// Add a new brand.
export const addNewBrand = createAsyncThunk('brands/addBrand', async (newBrandData, thunkAPI) => {
  try {
    const data = await addBrandToServer(newBrandData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "שגיאה בהוספת המותג");
  }
});

// Delete a brand.
export const removeBrand = createAsyncThunk('brands/deleteBrand', async (brandId, thunkAPI) => {
  try {
    await deleteBrandFromServer(brandId);
    return brandId; // מחזירים את ה-ID כדי שנוכל להעיף אותו מה-state ב-reducer
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "שגיאה במחיקת המותג");
  }
});

// Update a brand.
export const editBrand = createAsyncThunk('brands/updateBrand', async ({ brandId, updatedData }, thunkAPI) => {
  try {
    const data = await updateBrandOnServer(brandId, updatedData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "שגיאה בעדכון המותג");
  }
});

// --- Slice ---
const brandsSlice = createSlice({
  name: 'brands',
  initialState: { items: [], selectedBrand: null, loading: false, error: null },
  reducers: {
    // findBrandByName: (state, action) => {
    //   const name = action.payload.toLowerCase();
    //   state.selectedBrand = state.items.find(b => b.name.toLowerCase() === name) || null;
    // },
    clearSelectedBrand: (state) => { state.selectedBrand = null; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBrands.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBrands.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchBrands.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      //ByID
      .addCase(fetchBrandById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBrandById.fulfilled, (state, action) => { state.loading = false; state.selectedBrand = action.payload; })
      .addCase(fetchBrandById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      //ByName
      .addCase(fetchBrandByName.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBrandByName.fulfilled, (state, action) => { state.loading = false; state.selectedBrand = action.payload; })
      .addCase(fetchBrandByName.rejected, (state, action) => { state.loading = false; state.error = action.payload; })


      // Add (renamed to match the new thunk).
      .addCase(addNewBrand.fulfilled, (state, action) => { state.error = null; state.items.push(action.payload.brand); })
      .addCase(addNewBrand.rejected, (state, action) => { state.error = action.payload; })

      // Delete (renamed to match the new thunk).
      .addCase(removeBrand.fulfilled, (state, action) => {
        state.error = null;
        state.items = state.items.filter(b => (b._id || b.id) !== action.payload);
      })
      .addCase(removeBrand.rejected, (state, action) => { state.error = action.payload; })

      // Update (renamed to match the new thunk).
      .addCase(editBrand.fulfilled, (state, action) => {
         const updatedBrand = action.payload.brand;

        state.error = null;
        const idx = state.items.findIndex(b => (b._id || b.id) === (updatedBrand._id || updatedBrand.id));
        if (idx !== -1)
           state.items[idx] = updatedBrand;
      })
      .addCase(editBrand.rejected, (state, action) => { state.error = action.payload; });
  }
});

export const { clearSelectedBrand} = brandsSlice.actions;//findBrandByName, 
export default brandsSlice.reducer;