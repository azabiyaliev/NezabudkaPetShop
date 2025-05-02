import { createAsyncThunk } from "@reduxjs/toolkit";
import { ClientInfo, ClientInfoMutation, ValidationError } from '../../types';
import axiosApi from "../../axiosApi.ts";
import { isAxiosError } from "axios";

export const updateClientInfo = createAsyncThunk<
  void,
  { id: number; data: ClientInfoMutation },
  { rejectValue: ValidationError }
>("client_info/updateClientInfo", async ({ id, data }, { rejectWithValue }) => {
  try {

    await axiosApi.put(`/client_info/${id}`, data)

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

export const fetchClientInfo = createAsyncThunk<ClientInfo, void>(
  "client_info/fetchClientInfo",
  async () => {
    try {
      const response = await axiosApi.get<ClientInfo>(`/client_info`);
      return response.data;
    } catch (error) {
      console.error("Error fetching site data:", error);
      throw error;
    }
  },
);


