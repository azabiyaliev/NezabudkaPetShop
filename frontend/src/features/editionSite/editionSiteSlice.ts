import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store.ts";
import { EditSiteMutation, GlobalError } from '../../types';
import { updateSite } from './editionSiteThunk.ts';

interface EditSiteState {
  editSite: EditSiteMutation | null;
  editLoading: boolean;
  editError: GlobalError | null;
}

const initialState: EditSiteState = {
  editSite: null,
  editLoading: false,
  editError: null,
};

export const selectEditSite = (state: RootState) => state.edit_site.editSite;

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
      .addCase(updateSite.fulfilled, (state, action) => {
        state.editLoading = false;
        state.editSite = action.payload;
        state.editError = null;
      })
      .addCase(updateSite.rejected, (state, ) => {
        state.editLoading = false;
        state.editError =  null;
      });
  },
});

export const editSiteReducer = editSiteSlice.reducer;
