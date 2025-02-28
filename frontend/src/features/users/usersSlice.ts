import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store.ts";
import { GlobalError, User, ValidationError } from "../../types";
import { login, register } from "./usersThunk.ts";

interface UserState {
  user: User | null;
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginLoading: boolean;
  loginError: GlobalError | null;
}

const initialState: UserState = {
  user: null,
  registerLoading: false,
  registerError: null,
  loginLoading: false,
  loginError: null,
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
      .addCase(login.fulfilled, (state, { payload: user }) => {
        state.user = user;
        state.loginError = null;
      })
      .addCase(login.rejected, (state, { payload: error }) => {
        state.loginLoading = false;
        state.loginError = error || null;
      });
  },
});

export const userReducer = userSlice.reducer;
export const { unsetUser } = userSlice.actions;
