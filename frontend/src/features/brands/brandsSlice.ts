import { createSlice } from '@reduxjs/toolkit';
import { Brand } from '../../types';

interface BrandState {
  brands: Brand[];
  brand: Brand | null;
  loadings: {
    addLoading: boolean;
    getLoading: boolean;
    getOneLoading: boolean;
    editLoading: boolean;
    deleteLoading: boolean;
  },
  errors: boolean;
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
  errors: false,
}

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {}
});

export const brandReducer = brandsSlice.reducer;