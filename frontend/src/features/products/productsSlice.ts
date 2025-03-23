import { ProductRequest } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { addProduct } from './productsThunk.ts';
import { RootState } from '../../app/store.ts';

interface ProductsState {
  products: ProductRequest[];
  loading: boolean;
  error: boolean;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: false
}

export const addProductLoading = (state: RootState) => state.products.loading;

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers:{},
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state) => {
        state.loading = false;
      });
  }
})

export const productsReducer = productsSlice.reducer;