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

const itemMatches = (cartItem, itemData) => {
  const productId = String(itemData?.productId ?? itemData?.product?._id ?? "");
  const size = String(itemData?.size ?? cartItem?.size ?? "");

  return (
    String(cartItem?.product?._id || cartItem?.productId) === productId &&
    String(cartItem?.size ?? "") === size
  );
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
    updateLocalQuantity: (state, action) => {
      const { productId, quantity, size } = action.payload;

      if (!state.cart?.items) return;

      const item = state.cart.items.find((cartItem) =>
        itemMatches(cartItem, { productId, size })
      );

      if (!item) return;

      if (quantity < 1) {
        state.cart.items = state.cart.items.filter(
          (cartItem) => !itemMatches(cartItem, { productId, size })
        );
      } else {
        item.quantity = quantity;
      }

      state.cart = normalizeCart({ ...state.cart, items: state.cart.items });
    },
    removeLocalItem: (state, action) => {
      const itemData = action.payload;

      if (!state.cart?.items) return;

      state.cart.items = state.cart.items.filter(
        (cartItem) => !itemMatches(cartItem, itemData)
      );

      state.cart = normalizeCart({ ...state.cart, items: state.cart.items });
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
        state.cart = normalizeCart(action.payload || state.cart);
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = normalizeCart(action.payload || state.cart);
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cart = normalizeCart(action.payload || state.cart);
      });
  },
});

export const {
  resetCartError,
  updateLocalQuantity,
  removeLocalItem,
  openCartPreview,
  closeCartPreview,
} = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
