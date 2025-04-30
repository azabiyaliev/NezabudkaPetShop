import { ProductResponse, SubcategoryWithBrand } from '../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addProduct,
  editProduct,
  getAllProductsByCategory,
  getFilteredProducts, getFilteredProductsWithoutCategory,
  getOneProduct,
  getProducts,
  getProductsByBrand,
  getProductsByCategory,
  getPromotionalProducts
} from './productsThunk.ts';
import { RootState } from '../../app/store.ts';

interface ProductsState {
  products: ProductResponse[];
  categoryProducts: ProductResponse[];
  product: ProductResponse | null;
  brands: SubcategoryWithBrand[];
  brandProducts: ProductResponse[];
  promotionalProducts: ProductResponse[];
  loading: boolean;
  error: boolean;
}

const initialState: ProductsState = {
  brands: [],
  categoryProducts: [],
  products: [],
  brandProducts: [],
  promotionalProducts: [],
  product: null,
  loading: false,
  error: false,
};

export const addProductLoading = (state: RootState) => state.products.loading;
export const selectProductsByCategory = (state: RootState) => state.products.categoryProducts;
export const selectProducts = (state: RootState) => state.products.products;
export const selectPromotionalProducts = (state: RootState) => state.products.promotionalProducts;
export const selectBrandProducts = (state: RootState) => state.products.brandProducts;
export const selectProduct = (state: RootState) => state.products.product;

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
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
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action: PayloadAction<ProductResponse[]>) => {
        state.products = [];
        state.loading = false;
        state.products = action.payload;
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
      .addCase(
        getOneProduct.fulfilled,
        (state, {payload: product}) => {
          state.product = product;
          state.loading = false;
        },
      )
      .addCase(getOneProduct.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getProductsByBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsByBrand.fulfilled, (state, {payload: products}) => {
        state.brandProducts = [];
        state.loading = false;
        state.brandProducts = products;
      })
      .addCase(getProductsByBrand.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.categoryProducts = action.payload;
        state.loading = false;
        state.error = false;
      })
      .addCase(getProductsByCategory.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(getPromotionalProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPromotionalProducts.fulfilled, (state, {payload: products}) => {
        state.loading = false;
        state.promotionalProducts = products;
      })
      .addCase(getPromotionalProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getFilteredProducts.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getFilteredProducts.fulfilled, (state, action) => {
        state.categoryProducts = action.payload;
        state.loading = false;
        state.error = false;
      })
      .addCase(getFilteredProducts.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(getFilteredProductsWithoutCategory.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getFilteredProductsWithoutCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getFilteredProductsWithoutCategory.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const productsReducer = productsSlice.reducer;