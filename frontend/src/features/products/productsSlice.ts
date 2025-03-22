import { SubcategoryWithBrand } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { addProduct, getAllProductsByCategory } from './productsThunk.ts';
import { RootState } from '../../app/store.ts';

interface ProductsState {
  brands: SubcategoryWithBrand[];
  loading: boolean;
  error: boolean;
}

const initialState: ProductsState = {
  brands: [],
  loading: false,
  error: false
}

export const addProductLoading = (state: RootState) => state.products.loading

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers:{},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload
      })
      .addCase(getAllProductsByCategory.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state) => {
        state.loading = false;
      })
  }
})

export const productsReducer = productsSlice.reducer;