import { ProductRequest, ProductResponse } from '../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addProduct, editProduct, getOneProduct, getProducts } from './productsThunk.ts';
import { RootState } from '../../app/store.ts';

interface ProductsState {
  products: ProductResponse[];
  product: ProductRequest | null;
  loading: boolean;
  error: boolean;
}

const initialState: ProductsState = {
  products: [],
  product: null,
  loading: false,
  error: false
}

export const addProductLoading = (state: RootState) => state.products.loading
export const selectProducts = (state: RootState) => state.products.products;
export const selectProduct = (state: RootState) => state.products.product;

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
      })
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<ProductResponse[]>) => {
        state.products = action.payload
        state.loading = false;
      })
      .addCase(getProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editProduct.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getOneProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOneProduct.fulfilled, (state, action: PayloadAction<ProductRequest>) => {
        state.product = action.payload
        state.loading = false;
      })
      .addCase(getOneProduct.rejected, (state) => {
        state.loading = false;
      })

  }
})

export const productsReducer = productsSlice.reducer;