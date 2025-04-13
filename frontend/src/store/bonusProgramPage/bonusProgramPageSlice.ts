import { BonusProgramPage, ValidationError } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store.ts';
import { fetchBonusPage, updateBonusPage } from './bonusProgramPageThunk.ts';

interface BonusPageState {
  editBonusPage: BonusProgramPage | null;
  loading: boolean;
  error: ValidationError | null;
}

const initialState: BonusPageState = {
  editBonusPage: null,
  loading: false,
  error: null,
};

export const selectBonusProgram = (state: RootState) => state.bonus_program.editBonusPage;
export const selectBonusProgramError = (state: RootState) => state.bonus_program.error;

export const bonusPageSlice = createSlice({
  name: "bonus_program",
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(updateBonusPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBonusPage.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateBonusPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchBonusPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBonusPage.fulfilled, (state, action) => {
        state.loading = false;
        state.editBonusPage = action.payload;
      })
      .addCase(fetchBonusPage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const bonusPageReducer = bonusPageSlice.reducer;
