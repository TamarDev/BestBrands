import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyCart,
  addToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCartServer,
} from "../../API/ShoppingCartApi";

const handleThunkError = (err, thunkAPI) => {
  return thunkAPI.rejectWithValue(
    err.response?.data?.message || err.response?.data?.error || err.message
  );
};



const calculateCartSum = (items = []) => {
  return items.reduce((total, item) => {
    const price = item.product?.price || item.price || 0;
    const quantity = item.quantity || 0;
    return total + price * quantity;
  }, 0);
};

const normalizeCart = (cart) => {
  if (!cart) return null;

  const items = cart.items || [];

  return {
    ...cart,
    items,
    sum: calculateCartSum(items),
  };
};

// =======================
// GET CART
// =======================
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
    const response = await getMyCart();
    return response.cart;
    } catch (err) {
      return handleThunkError(err, thunkAPI);
    }
  }
);

// =======================
// ADD ITEM
// =======================
export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ productId, quantity = 1, size }, thunkAPI) => {
    try {
      const response = await addToCart(productId, quantity, size);
      return response.cart;
    } catch (err) {
      return handleThunkError(err, thunkAPI);
    }
  }
);

// =======================
// UPDATE ITEM QUANTITY
// =======================
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity, size }, thunkAPI) => {
    try {
      const response = await updateItemQuantity(productId, quantity, size);
      return response.cart;
    } catch (err) {
      return handleThunkError(err, thunkAPI);
    }
  }
);

// =======================
// REMOVE ITEM
// =======================
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async ({ productId, size }, thunkAPI) => {
    try {
      const response = await removeItemFromCart(productId, size);
      return response.cart;
    } catch (err) {
      return handleThunkError(err, thunkAPI);
    }
  }
);

// =======================
// CLEAR CART
// =======================
export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, thunkAPI) => {
    try {
      const response = await clearCartServer();
      return response.cart;
    } catch (err) {
      return handleThunkError(err, thunkAPI);
    }
  }
);

// =======================
// STATE & SLICE
// =======================
const initialState = {
  cart: null,
  loading: false,
  error: null,
  isCartPreviewOpen: false,
};

const shoppingCartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartError: (state) => {
      state.error = null;
    },
    openCartPreview: (state) => {
      state.isCartPreviewOpen = true;
    },
    closeCartPreview: (state) => {
      state.isCartPreviewOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = normalizeCart(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = normalizeCart(action.payload);
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.error = null;
        state.cart = normalizeCart(action.payload || state.cart);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.error = null;
        state.cart = normalizeCart(action.payload || state.cart);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.error = null;
        state.cart = normalizeCart(action.payload || state.cart);
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  resetCartError,
  openCartPreview,
  closeCartPreview,
} = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
