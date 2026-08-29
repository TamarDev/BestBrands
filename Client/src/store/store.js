import { configureStore } from '@reduxjs/toolkit';

import brandsReducer from './slices/BrandSlice';
import authReducer from './slices/AuthSlice';
import productsReducer from './slices/ProductSlice';
import cartReducer from './slices/ShoppingCartSlice';

export const store = configureStore({
  reducer: {
    brands: brandsReducer,
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});