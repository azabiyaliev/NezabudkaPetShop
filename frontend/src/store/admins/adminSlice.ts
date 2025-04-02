import { createSlice } from "@reduxjs/toolkit";
import { AdminDataMutation, ValidationError } from '../../types';
import { createAdmin, deleteAdmin, getAdmins, getOneAdmin, updateAdmin } from './adminThunks.ts';
import { RootState } from '../../app/store.ts';


interface AdminProps {
  admins: AdminDataMutation[];
  admin: AdminDataMutation | null;
  isLoading: boolean;
  isDelete: boolean;
  isCreate: boolean;
  isUpdate: boolean;
  inputError: ValidationError | null;
  deleteError: ValidationError | null;
}

const initialState: AdminProps = {
  admins: [],
  admin: null,
  isLoading: false,
  isDelete: false,
  isCreate: false,
  isUpdate: false,
  inputError: null,
  deleteError: null,
};

export const selectAdminError = (state: RootState) => state.admins.inputError;
export const selectAdmins = (state: RootState) => state.admins.admins;
export const selectOneAdmin = (state: RootState) => state.admins.admin;
export const updateLoading = (state: RootState) => state.admins.isUpdate;
export const createLoading = (state: RootState) => state.admins.isCreate;
export const deleteLoading = (state: RootState) => state.admins.isDelete;

export const adminSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    clearErrors(state) {
      state.inputError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdmins.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAdmins.fulfilled, (state, { payload: admins }) => {
        state.isLoading = false;
        state.admins = admins;
      })
      .addCase(getAdmins.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getOneAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOneAdmin.fulfilled, (state, { payload: admin }) => {
        state.isLoading = true;
        state.admin = admin;
      })
      .addCase(getOneAdmin.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createAdmin.pending, (state) => {
        state.isCreate = true;
        state.inputError = null;
      })
      .addCase(createAdmin.fulfilled, (state) => {
        state.isCreate = false
        state.inputError = null;
      })
      .addCase(createAdmin.rejected, (state, { payload: error }) => {
        state.isCreate = false;
        state.inputError = error || null;
      })
      .addCase(updateAdmin.pending, (state) => {
        state.isUpdate = true;
        state.inputError = null;
      })
      .addCase(updateAdmin.fulfilled, (state) => {
        state.isUpdate = false
        state.inputError = null;
      })
      .addCase(updateAdmin.rejected, (state, { payload: error }) => {
        state.isUpdate = false;
        state.inputError = error || null;
      })
      .addCase(deleteAdmin.pending, (state) => {
        state.isDelete = true;
        state.deleteError = null;
      })
      .addCase(deleteAdmin.fulfilled, (state) => {
        state.isDelete = false;
        state.deleteError = null;
      })
      .addCase(deleteAdmin.rejected, (state, { payload: error }) => {
        state.isDelete = false;
        state.deleteError = error || null;
      });
  },
});

export const adminReducer = adminSlice.reducer;
export const { clearErrors } = adminSlice.actions
