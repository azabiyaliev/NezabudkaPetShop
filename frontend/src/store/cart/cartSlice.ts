import { createSlice } from '@reduxjs/toolkit';
import { ICart } from '../../types';
import { addCart, cartDelete, editCart, emptyingTrash, getCart } from './cartThunk.ts';
import { RootState } from '../../app/store.ts';

interface CartSliceInterface {
  carts: ICart[];
  loadings: {
    addLoading: boolean;
    getLoading: boolean;
    deleteLoading: boolean;
    updateLoading: boolean;
  };
  error: boolean;
}

const initialState:CartSliceInterface = {
  carts: [],
  loadings: {
    addLoading: false,
    getLoading: false,
    deleteLoading: false,
    updateLoading: false,
  },
  error: false,
}

export const cartsFromSlice = (state: RootState) => state.carts.carts;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCart.pending, (state) => {
        state.loadings.addLoading = true;
        state.error = false;
      })
      .addCase(addCart.fulfilled, (state) => {
        state.loadings.addLoading = false;
        state.error = false;
      })
      .addCase(addCart.rejected, (state) => {
        state.loadings.addLoading = false;
        state.error = true;
      })
      .addCase(getCart.pending, (state) => {
        state.loadings.getLoading = true;
        state.error = false;
      })
      .addCase(getCart.fulfilled, (state, {payload: carts}) => {
        state.loadings.getLoading = false;
        state.error = false;
        state.carts = carts;
      })
      .addCase(getCart.rejected, (state) => {
        state.loadings.getLoading = false;
        state.error = true;
      })
      .addCase(editCart.pending, (state) => {
        state.loadings.updateLoading = true;
        state.error = false;
      })
      .addCase(editCart.fulfilled, (state) => {
        state.loadings.updateLoading = false;
        state.error = false;
      })
      .addCase(editCart.rejected, (state) => {
        state.loadings.updateLoading = false;
        state.error = true;
      })
      .addCase(cartDelete.pending, (state) => {
        state.loadings.deleteLoading = true;
        state.error = false;
      })
      .addCase(cartDelete.fulfilled, (state) => {
        state.loadings.deleteLoading = false;
        state.error = false;
      })
      .addCase(cartDelete.rejected, (state) => {
        state.loadings.deleteLoading = false;
        state.error = true;
      })
      .addCase(emptyingTrash.pending, (state) => {
        state.loadings.deleteLoading = true;
        state.error = false;
      })
      .addCase(emptyingTrash.fulfilled, (state, {payload: carts}) => {
        state.loadings.deleteLoading = false;
        state.error = false;
        state.carts = carts || [];
      })
      .addCase(emptyingTrash.rejected, (state) => {
        state.loadings.deleteLoading = false;
        state.error = true;
      });
  }
});

export const cartReducer = cartSlice.reducer;
