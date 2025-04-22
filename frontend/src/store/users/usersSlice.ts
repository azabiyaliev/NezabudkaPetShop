import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from "../../app/store.ts";
import { ErrorMutation, GlobalError, User, UserWithOrder, ValidationError } from '../../types';
import {
  changePasswordAsync,
  facebookLogin, fetchMe, fetchUserIdBonus, getAllUserWithOrder,
  googleLogin, logout,
  sendPasswordCode,
  verifyResetCode,
} from './usersThunk.ts';
import { login, register, updateUser } from "./usersThunk.ts";

interface UserState {
  user: User | null;
  users: User[];
  usersWithOrderCount:UserWithOrder[];
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginLoading: boolean;
  loginError: ValidationError | null;
  editLoading: boolean;
  editError: ValidationError | null;
  passwordCodeLoading: boolean;
  passwordCodeError: GlobalError | null;
  passwordCodeMessage: string | null;
  message: string | null;
  error: string | null;
  meChecked: boolean;
}

const initialState: UserState = {
  user: null,
  users:[],
  usersWithOrderCount: [],
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
  meChecked: false,
};

export const selectUser = (state: RootState) => state.users.user;
export const selectUsers = (state: RootState) => state.users.users;
export const selectUserWithCount =(state: RootState) => state.users.usersWithOrderCount;
export const selectUserLoading = (state: RootState) =>
  state.users.registerLoading;
export const selectUserError = (state: RootState) => state.users.registerError;
export const selectLoginLoading = (state: RootState) =>
  state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const meCheck = (state: RootState) => state.users.meChecked;
export const errorUpdate = (state: RootState) => state.users.editError

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setMeChecked(state) {
      state.meChecked = true;
    },
    unsetUser: (state) => {
      state.user = null;
      localStorage.removeItem('guestEmail');
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
      .addCase(fetchMe.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload
        state.loginLoading = false;
        state.meChecked = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loginLoading = false;
        state.meChecked = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
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
      })
      .addCase(updateUser.rejected, (state,{ payload: error }) => {
        state.editLoading = false;
        state.editError = error as ValidationError;
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
      })
      .addCase(getAllUserWithOrder.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(getAllUserWithOrder.fulfilled, (state, { payload: users }) => {
        state.loginLoading = false;
        state.usersWithOrderCount = users;
      })
      .addCase(getAllUserWithOrder.rejected, (state) => {
        state.loginLoading = false;
      })
      .addCase(fetchUserIdBonus.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(fetchUserIdBonus.fulfilled, (state, { payload: users }) => {
        state.loginLoading = false;
        state.user = users;
      })
      .addCase(fetchUserIdBonus.rejected, (state) => {
        state.loginLoading = false;
      })

  },
});

export const userReducer = userSlice.reducer;
export const  {setMeChecked, unsetUser} = userSlice.actions
