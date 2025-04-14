import { createAsyncThunk } from "@reduxjs/toolkit";
import { DeliveryPage, DeliveryPageMutation, ValidationError } from '../../types';
import axiosApi from "../../axiosApi.ts";
import { isAxiosError } from "axios";

export const updateDeliveryPage = createAsyncThunk<
  void,
  { id: number; data: DeliveryPageMutation },
  { rejectValue: ValidationError }
>("delivery/updateDeliveryPage", async ({ id, data }, { rejectWithValue }) => {
  try {

    await axiosApi.put(`/delivery/${id}`, data)

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

export const fetchDeliveryPage = createAsyncThunk<DeliveryPage, void>(
  "delivery/fetchDeliveryPage",
  async () => {
    try {
      const response = await axiosApi.get<DeliveryPage>(`/delivery`);
      return response.data;
    } catch (error) {
      console.error("Error fetching site data:", error);
      throw error;
    }
  },
);


