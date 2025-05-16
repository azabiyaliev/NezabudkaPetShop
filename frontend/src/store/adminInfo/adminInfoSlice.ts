import { AdminInfo, ValidationError } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store.ts';
import { fetchAdminInfo, updateAdminInfo } from './adminInfoThunk.ts';

interface AdminInfoState {
  editAdminInfo: AdminInfo | null;
  loading: boolean;
  error: ValidationError | null;
}

const initialState: AdminInfoState = {
  editAdminInfo: null,
  loading: false,
  error: null,
};

export const selectAdminInfo = (state: RootState) => state.admin_info.editAdminInfo;
export const selectAdminInfoError = (state: RootState) => state.admin_info.error;

export const adminInfoSlice = createSlice({
  name: "admin_info",
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(updateAdminInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminInfo.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateAdminInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchAdminInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.editAdminInfo = action.payload;
      })
      .addCase(fetchAdminInfo.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const adminInfoReducer = adminInfoSlice.reducer;
