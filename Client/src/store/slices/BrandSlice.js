import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// 1. מחקנו את ה-import של axios הרגיל! אין בו צורך כאן יותר.

// 2. מייבאים את פונקציות ה-API שלנו (שימי לב לשמות)
import { 
  getAllBrands, 
  getBrandById, 
  getBrandByName,
  addBrand as addBrandToServer, // נתנו לו שם זמני כדי שלא יתנגש עם ה-Thunk
  updateBrand as updateBrandOnServer, 
  deleteBrand as deleteBrandFromServer 
} from '../../API/BrandApi';

// --- פעולות אסינכרוניות (Thunks) ---

// קבלת כל המותגים
export const fetchBrands = createAsyncThunk('brands/fetchBrands', async (_, thunkAPI) => {
  try {
    // קוראים ישירות לפונקציה מה-API. היא כבר יודעת את הכתובת ומביאה את הטוקן!
    const data = await getAllBrands(); 
    return data;
  } catch (error) {
    //השורה הזאת נמצאת באופן זמני
    console.error("שגיאה מבוצעת ב-Thunk:", error);

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

// הוספת מותג חדש
export const addNewBrand = createAsyncThunk('brands/addBrand', async (newBrandData, thunkAPI) => {
  try {
    const data = await addBrandToServer(newBrandData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "שגיאה בהוספת המותג");
  }
});

// מחיקת מותג
export const removeBrand = createAsyncThunk('brands/deleteBrand', async (brandId, thunkAPI) => {
  try {
    await deleteBrandFromServer(brandId);
    return brandId; // מחזירים את ה-ID כדי שנוכל להעיף אותו מה-state ב-reducer
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "שגיאה במחיקת המותג");
  }
});

// עדכון מותג
export const editBrand = createAsyncThunk('brands/updateBrand', async ({ brandId, updatedData }, thunkAPI) => {
  try {
    const data = await updateBrandOnServer(brandId, updatedData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "שגיאה בעדכון המותג");
  }
});

// --- ה-Slice ---
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


      // Add (שינוי לשם ה-Thunk החדש)
      .addCase(addNewBrand.fulfilled, (state, action) => { state.items.push(action.payload.brand); })
      
      // Delete (שינוי לשם ה-Thunk החדש)
      .addCase(removeBrand.fulfilled, (state, action) => {
        state.items = state.items.filter(b => (b._id || b.id) !== action.payload);
      })
      
      // Update (שינוי לשם ה-Thunk החדש)
      .addCase(editBrand.fulfilled, (state, action) => {
         const updatedBrand = action.payload.brand;

        const idx = state.items.findIndex(b => (b._id || b.id) === (updatedBrand._id || updatedBrand.id));
        if (idx !== -1)
           state.items[idx] = updatedBrand;
      });
  }
});

export const { clearSelectedBrand} = brandsSlice.actions;//findBrandByName, 
export default brandsSlice.reducer;