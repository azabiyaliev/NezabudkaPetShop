import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from "../../app/store.ts";
import { ErrorMutation, GlobalError, User, ValidationError } from '../../types';
import {
  changePasswordAsync,
  facebookLogin,
  googleLogin,
  sendPasswordCode,
  verifyResetCode,
} from "./usersThunk.ts";
import { login, register, updateUser } from "./usersThunk.ts";

interface UserState {
  user: User | null;
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginLoading: boolean;
  loginError: ValidationError | null;
  editLoading: boolean;
  editError: GlobalError | null;
  passwordCodeLoading: boolean;
  passwordCodeError: GlobalError | null;
  passwordCodeMessage: string | null;
  message: string | null;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  registerLoading: false,
  registerError: null,
  loginLoading: false,
  loginError: null,
  editLoading: false,
  editError: null,
  passwordCodeLoading: false,
  passwordCodeError: null,
  passwordCodeMessage: null,
  message: null,
  error: null,
};

export const selectUser = (state: RootState) => state.users.user;
export const selectUserLoading = (state: RootState) =>
  state.users.registerLoading;
export const selectUserError = (state: RootState) => state.users.registerError;
export const selectLoginLoading = (state: RootState) =>
  state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(register.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, { payload: registerResponse }) => {
        state.user = registerResponse.user;
        state.registerError = null;
      })
      .addCase(register.rejected, (state, { payload: error }) => {
        state.registerLoading = false;
        state.registerError = error || null;
      })
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.loginError = null;
      })
      .addCase(login.rejected, (state, { payload: error }) => {
        state.loginLoading = false;
        state.loginError = error || null;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(googleLogin.fulfilled, (state, { payload: user }) => {
        state.user = user;
        state.loginLoading = false;
      })
      .addCase(googleLogin.rejected, (state, { payload: error }) => {
        state.loginLoading = false;
        state.loginError = error || null;
      })
      .addCase(facebookLogin.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(facebookLogin.fulfilled, (state, { payload: user }) => {
        state.user = user;
        state.loginLoading = false;
      })
      .addCase(facebookLogin.rejected, (state, { payload: error }) => {
        state.loginLoading = false;
        state.loginError = error || null;
      })
      .addCase(updateUser.pending, (state) => {
        state.editLoading = true;
        state.editError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.editLoading = false;
        state.user = action.payload;
        state.editError = null;
      })
      .addCase(updateUser.rejected, (state) => {
        state.editLoading = false;
        state.editError = null;
      })
      .addCase(sendPasswordCode.pending, (state) => {
        state.passwordCodeLoading = true;
        state.passwordCodeError = null;
      })
      .addCase(sendPasswordCode.fulfilled, (state) => {
        state.passwordCodeLoading = false;
      })
      .addCase(sendPasswordCode.rejected, (state) => {
        state.passwordCodeLoading = false;
        state.passwordCodeError = null;
      })
      .addCase(verifyResetCode.pending, (state) => {
        state.passwordCodeLoading = true;
        state.passwordCodeError = null;
      })
      .addCase(verifyResetCode.fulfilled, (state,action: PayloadAction<ErrorMutation>) => {
        state.passwordCodeLoading = false;
        state.message = action.payload.message;
      })
      .addCase(verifyResetCode.rejected, (state) => {
        state.passwordCodeLoading = false;
        state.passwordCodeError = null;
      })
      .addCase(changePasswordAsync.pending, (state) => {
        state.passwordCodeLoading = true;
        state.passwordCodeError = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state, action) => {
        state.passwordCodeLoading = false;
        state.passwordCodeMessage = action.payload.message;
      })
      .addCase(changePasswordAsync.rejected, (state) => {
        state.passwordCodeLoading = false;
        state.passwordCodeError = null;
      });
  },
});

export const userReducer = userSlice.reducer;
export const { unsetUser } = userSlice.actions;
