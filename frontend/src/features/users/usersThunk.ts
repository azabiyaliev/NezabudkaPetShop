import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import { isAxiosError } from "axios";
import {
  AdminRefactor,
  GlobalError,
  LogInMutation,
  RegisterMutation,
  RegisterResponse,
  User,
  ValidationError,
} from '../../types';
import { RootState } from '../../app/store.ts';

export const register = createAsyncThunk<
  RegisterResponse,
  RegisterMutation,
  { rejectValue: ValidationError }
>("users/register", async (registerMutation, { rejectWithValue }) => {
  try {
    const { data: user } = await axiosApi.post<RegisterResponse>(
      "/auth/register",
      registerMutation,
    );
    return user;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const { data } = error.response;
      if (error.response.status === 400 && data.errors) {
        return rejectWithValue(data as ValidationError);
      }
    }
    throw error;
  }
});

export const login = createAsyncThunk<
  User,
  LogInMutation,
  { rejectValue: GlobalError }
>("users/login", async (LogInMutation, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<RegisterResponse>(
      "/auth/login",
      LogInMutation,
    );
    return response.data.user;

  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      if (status === 404 && data.error) {
        return rejectWithValue(data as GlobalError);
      }

      if (status === 401 && data.error) {
        return rejectWithValue(data as GlobalError);
      }
    }
    throw error;
  }
});

export const updateUser = createAsyncThunk<User, {id: number, data: Partial<User>}, { state: RootState; ejectValue: GlobalError }>(
  'users/updateUser',
  async ( {id, data} , { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.users.user?.token;

    if (!token) {
      return rejectWithValue({ error: 'No token provided' });
    }

    try {
      const response = await axiosApi.put(`/users/${id}`, data);

      return response.data || [];
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 404 && data.error) {
          return rejectWithValue(data as GlobalError);
        }

        if (status === 401 && data.error) {
          return rejectWithValue(data as GlobalError);
        }
      }
      throw error;
    }
  }
);

export const fetchUserById = createAsyncThunk<AdminRefactor, string>(
  "users/fetchUserById",
  async (userId) => {
    const response = await axiosApi.get<AdminRefactor>(
      `/users/${userId}`,
    );
    return response.data;
  },
);

