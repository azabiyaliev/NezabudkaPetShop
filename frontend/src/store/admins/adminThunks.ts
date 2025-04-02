import { createAsyncThunk } from "@reduxjs/toolkit";
import { AdminDataMutation, ValidationError } from "../../types";
import axiosApi from "../../axiosApi.ts";
import { isAxiosError } from "axios";

export const createAdmin = createAsyncThunk<
  void,
  AdminDataMutation,
  { rejectValue: ValidationError }
>("admins/create", async (data: AdminDataMutation, { rejectWithValue }) => {
  try {
    await axiosApi.post<AdminDataMutation>("/users", data);
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

export const getAdmins = createAsyncThunk<AdminDataMutation[], void>(
  "users/getAdmins",
  async () => {
    const response = await axiosApi<AdminDataMutation[]>("/users/admins");
    return response.data || [];
  },
);

export const getOneAdmin = createAsyncThunk<
  AdminDataMutation,
  number,
  { rejectValue: ValidationError }
>("users/getOneAdmin", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get<AdminDataMutation>(`users/admin/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data) {
      return rejectWithValue(error.response.data as ValidationError);
    }
    throw error;
  }
});

export const updateAdmin = createAsyncThunk<
  AdminDataMutation,
  { id: number; adminData: AdminDataMutation },
  { rejectValue: ValidationError }
>("users/updateAdmin", async ({ id, adminData }, { rejectWithValue }) => {
  try {
    const response = await axiosApi.put<AdminDataMutation>(
      `/users/${id}`,
      adminData,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data as ValidationError);
    }
    throw error;
  }
});

export const deleteAdmin = createAsyncThunk<
  void,
  number,
  { rejectValue: ValidationError }
>("users/deleteAdmin", async (id, { rejectWithValue }) => {
  try {
    await axiosApi.delete(`users/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response?.data) {
      return rejectWithValue(error.response.data as ValidationError);
    }
    throw error;
  }
});
