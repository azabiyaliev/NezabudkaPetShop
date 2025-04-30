import { ClientInfo, ValidationError } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store.ts';
import { fetchClientInfo, updateClientInfo } from './clientInfoThunk.ts';

interface ClientInfoState {
  editClientInfo: ClientInfo | null;
  loading: boolean;
  error: ValidationError | null;
}

const initialState: ClientInfoState = {
  editClientInfo: null,
  loading: false,
  error: null,
};

export const selectClientInfo = (state: RootState) => state.client_info.editClientInfo;
export const selectClientInfoError = (state: RootState) => state.client_info.error;

export const clientInfoSlice = createSlice({
  name: "client_info",
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(updateClientInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClientInfo.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateClientInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchClientInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClientInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.editClientInfo = action.payload;
      })
      .addCase(fetchClientInfo.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const clientInfoReducer = clientInfoSlice.reducer;
