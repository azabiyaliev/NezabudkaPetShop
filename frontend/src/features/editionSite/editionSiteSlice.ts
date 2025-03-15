import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store.ts";
import { EditSite, ValidationError } from '../../types';
import { fetchSite, updateSite } from './editionSiteThunk.ts';

interface EditSiteState {
  editSite: EditSite | null;
  editLoading: boolean;
  editError: ValidationError | null;
  isLoading: boolean;
}

const initialState: EditSiteState = {
  editSite: null,
  editLoading: false,
  editError: null,
  isLoading: false,
};

export const selectEditSite = (state: RootState) => state.edit_site.editSite;
export const selectError = (state: RootState) => state.edit_site.editError;

export const editSiteSlice = createSlice({
  name: "edit_site",
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(updateSite.pending, (state) => {
        state.editLoading = true;
        state.editError = null;
      })
      .addCase(updateSite.fulfilled, (state) => {
        state.editLoading = false;
        state.editError = null;
      })
      .addCase(updateSite.rejected, (state, action, ) => {
        state.editLoading = false;
        state.editError =  action.payload || null;
      })
      .addCase(fetchSite.pending, (state) => {
        state.editLoading = true;
      })
      .addCase(fetchSite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.editSite = action.payload;
      })
      .addCase(fetchSite.rejected, (state, ) => {
        state.isLoading = false;
      });
  },
});

export const editSiteReducer = editSiteSlice.reducer;
