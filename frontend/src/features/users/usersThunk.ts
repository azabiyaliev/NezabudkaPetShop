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
} from "../../types";
import { RootState } from "../../app/store.ts";

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
      const { data, status } = error.response;
      if ([400, 401, 409].includes(status)) {
        const formattedErrors = typeof data.errors === "object"
          ? data.errors
          : { general: data.message };
        return rejectWithValue({ errors: formattedErrors } as ValidationError);
      }
    }
    throw error;
  }
});

export const login = createAsyncThunk<RegisterResponse, LogInMutation, { rejectValue: ValidationError }>(
  "users/login",
  async (LogInMutation, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<RegisterResponse>("/auth/login", LogInMutation);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const { data, status } = error.response;

        if ([400, 401, 409].includes(status)) {
          const formattedErrors =
            typeof data.errors === "object"
              ? data.errors
              : { general: data.message };
          return rejectWithValue({ errors: formattedErrors } as ValidationError);
        }
      }
      throw error;
    }
  }
);

export const updateUser = createAsyncThunk<
  User,
  { id: number; data: Partial<User> },
  {
    state: RootState;
    ejectValue: GlobalError;
  }
>("users/updateUser", async ({ id, data }, { getState, rejectWithValue }) => {
  const state = getState();
  const token = state.users.user?.token;

  if (!token) {
    return rejectWithValue({ error: "No token provided" });
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
});

export const fetchUserById = createAsyncThunk<AdminRefactor, string>(
  "users/fetchUserById",
  async (userId) => {
    const response = await axiosApi.get<AdminRefactor>(`/users/${userId}`);
    return response.data;
  },
);

export const googleLogin = createAsyncThunk<
  User,
  string,
  { rejectValue: ValidationError }
>("users/googleLogin", async (credential, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<RegisterResponse>("/auth/google", {
      credential,
    });
    console.log(response.data);
    return response.data.user;
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }
    throw e;
  }
});

export const facebookLogin = createAsyncThunk<
  User,
  { accessToken: string },
  { rejectValue: ValidationError }
>("users/facebookLogin", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<RegisterResponse>(
      "auth/facebook",
      data,
    );
    console.log(response.data.user);
    return response.data.user;
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      error.response.status === 400
    ) {
      return rejectWithValue(error.response.data as ValidationError);
    }

    throw error;
  }
});
