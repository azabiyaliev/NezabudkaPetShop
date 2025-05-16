import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AdminInfo,
  AdminInfoMutation,
  ValidationError
} from '../../types';
import axiosApi from "../../axiosApi.ts";
import { isAxiosError } from "axios";

export const updateAdminInfo = createAsyncThunk<
  void,
  { id: number; data: AdminInfoMutation },
  { rejectValue: ValidationError }
>("admin_info/updateAdminInfo", async ({ id, data }, { rejectWithValue }) => {
  try {

    await axiosApi.put(`/admin_info/${id}`, data)

  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const { data, status } = error.response;

      if ([400, 401, 409].includes(status)) {
        const formattedErrors =
          typeof data.errors === 'object' ? data.errors : { general: data.message };

        return rejectWithValue({ errors: formattedErrors } as ValidationError);
      }
    }
    throw error;
  }
});

export const fetchAdminInfo = createAsyncThunk<AdminInfo, void>(
  "admin_info/fetchAdminInfo",
  async () => {
    try {
      const response = await axiosApi.get<AdminInfo>(`/admin_info`);
      return response.data;
    } catch (error) {
      console.error("Error fetching site data:", error);
      throw error;
    }
  },
);


