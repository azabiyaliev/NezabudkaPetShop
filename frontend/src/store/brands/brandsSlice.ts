import { createSlice } from "@reduxjs/toolkit";
import { BrandError, GlobalError, IBrand, IBrandForm } from '../../types';
import {
  addBrand,
  brandeDelete,
  editBrand,
  getBrands,
  getOneBrand,
} from "./brandsThunk.ts";
import { RootState } from "../../app/store.ts";

interface BrandState {
  brands: IBrand[];
  brand: IBrandForm | null;
  loadings: {
    addLoading: boolean;
    getLoading: boolean;
    getOneLoading: boolean;
    editLoading: boolean;
    deleteLoading: boolean;
  },
  errors: {
    addError: BrandError | null;
    getError: boolean;
    getOneError: GlobalError | null;
    deleteError: GlobalError | null;
    editError: BrandError | null;
  }
}

const initialState: BrandState = {
  brands: [],
  brand: null,
  loadings: {
    addLoading: false,
    getLoading: false,
    getOneLoading: false,
    editLoading: false,
    deleteLoading: false,
  },
  errors: {
    addError: null,
    getError: false,
    getOneError: null,
    deleteError: null,
    editError: null,
  }
}

export const brandsFromSlice = (state: RootState) => state.brands.brands;
export const brandFromSlice = (state: RootState) => state.brands.brand;
export const addLoadingFromSlice = (state: RootState) =>
  state.brands.loadings.addLoading;
export const editLoadingFromSlice = (state: RootState) =>
  state.brands.loadings.editLoading;
export const addErrorFromSlice = (state: RootState) => state.brands.errors.addError;
export const editErrorFromSlice = (state: RootState) => state.brands.errors.editError;

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    clearBrand: (state) => {
      state.brand = null;
    },
    clearError: (state) => {
      state.errors.addError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBrand.pending, (state) => {
        state.loadings.addLoading = true;
        state.errors.addError = null;
      })
      .addCase(addBrand.fulfilled, (state) => {
        state.loadings.addLoading = false;
        state.errors.addError = null;
      })
      .addCase(addBrand.rejected, (state, {payload: error}) => {
        state.loadings.addLoading = false;
        state.errors.addError = error || null;
      })
      .addCase(getBrands.pending, (state) => {
        state.loadings.getLoading = true;
        state.errors.getError = false;
      })
      .addCase(getBrands.fulfilled, (state, {payload: brands}) => {
        state.loadings.getLoading = false;
        state.errors.getError = false;
        state.brands = brands;
      })
      .addCase(getBrands.rejected, (state) => {
        state.loadings.getLoading = false;
        state.errors.getError = true;
      })
      .addCase(getOneBrand.pending, (state) => {
        state.loadings.getOneLoading = true;
        state.errors.getOneError = null;
      })
      .addCase(getOneBrand.fulfilled, (state, {payload: brand}) => {
        // state.brand = null;
        state.loadings.getOneLoading = false;
        state.errors.getOneError = null;
        state.brand = { ...brand};
      })
      .addCase(getOneBrand.rejected, (state, {payload: error}) => {
        state.loadings.getOneLoading = false;
        state.errors.getOneError = error || null;
      })
      .addCase(brandeDelete.pending, (state) => {
        state.loadings.deleteLoading = true;
        state.errors.deleteError = null;
      })
      .addCase(brandeDelete.fulfilled, (state) => {
        state.loadings.deleteLoading = false;
        state.errors.deleteError = null;
      })
      .addCase(brandeDelete.rejected, (state, {payload: error}) => {
        state.loadings.deleteLoading = false;
        state.errors.deleteError = error || null;
      })
      .addCase(editBrand.pending, (state) => {
        state.loadings.editLoading = true;
        state.errors.editError = null;
      })
      .addCase(editBrand.fulfilled, (state) => {
        state.loadings.editLoading = false;
        state.errors.editError = null;
      })
      .addCase(editBrand.rejected, (state, {payload: error}) => {
        state.loadings.editLoading = false;
        state.errors.editError = error || null;
      });
  },
});

export const brandReducer = brandsSlice.reducer;
export const { clearError, clearBrand } = brandsSlice.actions;
