import { DeliveryPage, ValidationError } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store.ts';
import { fetchDeliveryPage, updateDeliveryPage } from './deliveryPageThunk.ts';

interface DeliveryPageState {
  editDelivery: DeliveryPage | null;
  loading: boolean;
  error: ValidationError | null;
}

const initialState: DeliveryPageState = {
  editDelivery: null,
  loading: false,
  error: null,
};

export const selectDelivery = (state: RootState) => state.delivery.editDelivery;
export const selectDeliveryError = (state: RootState) => state.delivery.error;

export const deliveryPageSlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(updateDeliveryPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeliveryPage.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateDeliveryPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchDeliveryPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeliveryPage.fulfilled, (state, action) => {
        state.loading = false;
        state.editDelivery = action.payload;
      })
      .addCase(fetchDeliveryPage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const deliveryPageReducer = deliveryPageSlice.reducer;
