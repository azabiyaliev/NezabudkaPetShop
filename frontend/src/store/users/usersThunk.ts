import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import { isAxiosError } from "axios";
import {
  AdminRefactor,
  ChangePasswordPayload,
  ChangePasswordResponse, ErrorMutation,
  LogInMutation,
  RegisterMutation,
  RegisterResponse,
  User, UserWithOrder,
  ValidationError,
  VerifyResetCodePayload,
  VerifyResetCodeResponse,
} from '../../types';
import { RootState } from "../../app/store.ts";

export const register = createAsyncThunk<
  RegisterResponse,
  RegisterMutation,
  { rejectValue: ValidationError }
>("users/register", async (registerMutation, { rejectWithValue }) => {
  try {
    const { data: user } = await axiosApi.post<RegisterResponse>(
      "/auth/register",
      {
        ...registerMutation,
        recaptchaToken: registerMutation.recaptchaToken
      }

    );

    if(registerMutation.guestEmail) {
      await axiosApi.patch('/orders/transfer', {
        guestEmail: registerMutation.guestEmail,
        userId: user.user.id,
      })
    }
    return user;
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
});

export const login = createAsyncThunk<
  RegisterResponse,
  LogInMutation,
  { rejectValue: ValidationError }
>("users/login", async (LogInMutation, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post<RegisterResponse>(
      "/auth/login",
      LogInMutation,
    );
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
});

export const fetchMe = createAsyncThunk<User>(
  'users/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get('/auth/me');
      return response.data;
    } catch (e) {
      if (isAxiosError(e)) {
        if (e.response?.status === 401) {
          return null;
        }
        if (e.response?.data) {
          return rejectWithValue(e.response.data);
        }
      }
      return rejectWithValue('Ошибка получения данных');
    }
  }
);

export const updateUser = createAsyncThunk<
  User,
  { id: number; data: Partial<User> },
  {
    state: RootState;
    ejectValue: ValidationError;
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
        return rejectWithValue(data as ValidationError);
      }

      if (status === 401 && data.error) {
        return rejectWithValue(data as ValidationError);
      }
    }
    throw error;
  }
});

export const fetchUserById = createAsyncThunk<AdminRefactor, string>(
  "users/fetchUserById",
  async (userId,{ getState }) => {
    const state = getState() as RootState;
    const existingUser = state.users.user;

    if (existingUser && existingUser.id === Number(userId)) {
      return existingUser;
    }
    const response = await axiosApi.get<AdminRefactor>(`/users/${userId}`);
    return response.data;
  },
);

export const fetchUserIdBonus = createAsyncThunk<User, string>(
  "users/fetchUserById",
  async (userId) => {
    const response = await axiosApi.get<User>(`/users/account/${userId}`);
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

export const logout = createAsyncThunk<void>(
  'users/logout',
  async () => {
    await axiosApi.delete('/auth/logout');
  }
);

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

export const sendPasswordCode = createAsyncThunk<
  void,
  string,
  { rejectValue: ValidationError }
>("user/sendPasswordCode", async (email, { rejectWithValue }) => {
  try {
    const response = await axiosApi.post("/users/send-password-code", {
      email,
    });
    return response.data;
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

export const verifyResetCode = createAsyncThunk<
  VerifyResetCodeResponse,
  VerifyResetCodePayload,
  { rejectValue: ErrorMutation }
>(
  "user/verifyResetCode",
  async ({ resetToken, newPassword }, { rejectWithValue }) => {
    try {
      console.log("Data sent to backend : ", { resetToken, newPassword });
      const response = await axiosApi.put("/users/change-password", {
        resetToken,
        newPassword,
      });
      return response.data;
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response &&
        error.response.status === 400
      ) {
        return rejectWithValue(error.response.data as ErrorMutation);
      }
      throw error;
    }
  },
);

export const changePasswordAsync = createAsyncThunk<
  ChangePasswordResponse,
  ChangePasswordPayload,
  { state: RootState; rejectValue: ErrorMutation }
>(
  "user/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    console.log("Sending PATCH request with:", {
      currentPassword,
      newPassword,
    });
    try {
      const response = await axiosApi.patch(
        "/users/new-password",
        {
          currentPassword,
          newPassword,
        },
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          return rejectWithValue(error.response.data as ErrorMutation);
        }
        throw new Error('Unexpected error occurred.');
      }
      throw error;
    }
  }
);

export const getAllUser = createAsyncThunk<User[], void>(
  "users/getAllUser",
  async () => {
    const response = await axiosApi<User[]>("/users");
    return response.data || [];
  },
);

export const getAllUserWithOrder = createAsyncThunk<UserWithOrder[], void>(
  "users/getAllUser",
  async () => {
    const response = await axiosApi<UserWithOrder[]>("/users/orders/clients");
    return response.data || [];
  },
);

export const updateBonus = createAsyncThunk<User[], { userId: number, bonusAmount: number }>(
  'users/updateBonus',
  async ({ userId, bonusAmount }) => {
    try {
      const response = await axiosApi.patch(`/users/${userId}/bonus`, { bonusAmount });
      return response.data || [];
    } catch (error) {
      console.error(error);
    }
  }
);

