import { CompanyPage, ValidationError } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { fetchCompanyPage, updateCompanyPage } from './companyPageThunk.ts';
import { RootState } from '../../app/store.ts';

interface CompanyPageState {
  editCompany: CompanyPage | null;
  loading: boolean;
  error: ValidationError | null;
}

const initialState: CompanyPageState = {
  editCompany: null,
  loading: false,
  error: null,
};

export const selectCompany = (state: RootState) => state.company_page.editCompany;
export const selectCompanyError = (state: RootState) => state.company_page.error;

export const companyPageSlice = createSlice({
  name: "company_page",
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(updateCompanyPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyPage.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateCompanyPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchCompanyPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyPage.fulfilled, (state, action) => {
        state.loading = false;
        state.editCompany = action.payload;
      })
      .addCase(fetchCompanyPage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const companyPageReducer = companyPageSlice.reducer;
