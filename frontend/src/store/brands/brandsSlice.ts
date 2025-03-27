import { createSlice } from "@reduxjs/toolkit";
import { GlobalError, IBrand, IBrandForm } from "../../types";
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
  };
  error: boolean;
  addError: GlobalError | null;
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
  error: false,
  addError: null,
};

export const brandsFromSlice = (state: RootState) => state.brands.brands;
export const brandFromSlice = (state: RootState) => state.brands.brand;
export const addLoadingFromSlice = (state: RootState) =>
  state.brands.loadings.addLoading;
export const editLoadingFromSlice = (state: RootState) =>
  state.brands.loadings.editLoading;
export const addErrorFromSlice = (state: RootState) => state.brands.addError;

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    clearError: (state) => {
      state.addError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBrand.pending, (state) => {
        state.loadings.addLoading = true;
        state.addError = null;
      })
      .addCase(addBrand.fulfilled, (state) => {
        state.loadings.addLoading = false;
        state.addError = null;
      })
      .addCase(addBrand.rejected, (state, { payload: error }) => {
        state.loadings.addLoading = false;
        state.addError = error || null;
      })
      .addCase(getBrands.pending, (state) => {
        state.loadings.getLoading = true;
        state.error = false;
      })
      .addCase(getBrands.fulfilled, (state, { payload: brands }) => {
        state.loadings.getLoading = false;
        state.error = false;
        state.brands = brands;
      })
      .addCase(getBrands.rejected, (state) => {
        state.loadings.getLoading = false;
        state.error = true;
      })
      .addCase(getOneBrand.pending, (state) => {
        state.loadings.getOneLoading = true;
        state.error = false;
      })
      .addCase(getOneBrand.fulfilled, (state, { payload: brand }) => {
        state.loadings.getOneLoading = false;
        state.error = false;
        state.brand = brand;
      })
      .addCase(getOneBrand.rejected, (state) => {
        state.loadings.getOneLoading = false;
        state.error = true;
      })
      .addCase(brandeDelete.pending, (state) => {
        state.loadings.deleteLoading = true;
        state.error = false;
      })
      .addCase(brandeDelete.fulfilled, (state) => {
        state.loadings.deleteLoading = false;
        state.error = false;
      })
      .addCase(brandeDelete.rejected, (state) => {
        state.loadings.deleteLoading = false;
        state.error = true;
      })
      .addCase(editBrand.pending, (state) => {
        state.loadings.editLoading = true;
        state.error = false;
      })
      .addCase(editBrand.fulfilled, (state) => {
        state.loadings.editLoading = false;
        state.error = false;
      })
      .addCase(editBrand.rejected, (state) => {
        state.loadings.editLoading = false;
        state.error = true;
      });
  },
});

export const brandReducer = brandsSlice.reducer;
export const { clearError } = brandsSlice.actions;
