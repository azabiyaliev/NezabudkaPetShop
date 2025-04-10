import { createSlice } from '@reduxjs/toolkit';
import { createCart, fetchCart } from './cartThunk.ts';
import { GlobalError, ICartBack } from '../../types';
import { RootState } from '../../app/store.ts';

interface CartState {
  cart: ICartBack | null;
  loadings: {
    getLoading: boolean;
    createLoading: boolean;
    deleteLoading: boolean;
    addProductLoading: boolean;
    editProductLoading: boolean;
    deleteProductLoading: boolean;
  },
  errors: {
    getCartError: GlobalError | null;
    createError: GlobalError | null;
  },
}

const initialState: CartState = {
  cart: null,
  loadings: {
    getLoading: false,
    createLoading: false,
    deleteLoading: false,
    addProductLoading: false,
    editProductLoading: false,
    deleteProductLoading: false,
  },
  errors: {
    getCartError: null,
    createError: null,
  },
}

export const cartFromSlice = (state: RootState)=> state.cart.cart;
export const cartErrorFromSlice = (state: RootState)=> state.cart.errors.getCartError;
export const cartCreateErrorFromSlice = (state: RootState)=> state.cart.errors.createError;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loadings.getLoading = true;
        state.errors.getCartError = null;
      })
      .addCase(fetchCart.fulfilled, (state, {payload: cart}) => {
        state.loadings.getLoading = false;
        state.errors.getCartError = null;
        state.cart = cart;
      })
      .addCase(fetchCart.rejected, (state, {payload: error}) => {
        state.loadings.getLoading = false;
        state.errors.getCartError = error || null;
      })
      .addCase(createCart.pending, (state) => {
        state.loadings.createLoading = true;
        state.errors.createError = null;
      })
      .addCase(createCart.fulfilled, (state) => {
        state.loadings.createLoading = false;
        state.errors.createError = null;
      })
      .addCase(createCart.rejected, (state, {payload: error}) => {
        state.loadings.createLoading = false;
        state.errors.createError = error || null;
      });
  }
});

export const cartReducer = cartSlice.reducer;
export const { clearCart } = cartSlice.actions;