import { createSlice } from '@reduxjs/toolkit';
import { addItem, createCart, fetchCart } from './cartThunk.ts';
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
    addProductError: GlobalError | null;
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
    addProductError: null,
  },
}

export const cartFromSlice = (state: RootState)=> state.cart.cart;
export const cartErrorFromSlice = (state: RootState)=> state.cart.errors.getCartError;
export const cartCreateErrorFromSlice = (state: RootState)=> state.cart.errors.createError;
export const addProductErrorFromSlice = (state: RootState)=> state.cart.errors.addProductError;

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
      })
      .addCase(addItem.pending, (state) => {
        state.loadings.addProductLoading = true;
        state.errors.addProductError = null;
      })
      .addCase(addItem.fulfilled, (state) => {
        state.loadings.addProductLoading = false;
        state.errors.addProductError = null;
      })
      .addCase(addItem.rejected, (state, {payload: error}) => {
        state.loadings.addProductLoading = false;
        state.errors.addProductError = error || null;
      });
  }
});

export const cartReducer = cartSlice.reducer;
export const { clearCart } = cartSlice.actions;