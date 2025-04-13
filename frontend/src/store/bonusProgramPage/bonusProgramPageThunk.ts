import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  BonusProgramPage,
  BonusProgramPageMutation,
  ValidationError
} from '../../types';
import axiosApi from "../../axiosApi.ts";
import { isAxiosError } from "axios";

export const updateBonusPage = createAsyncThunk<
  void,
  { id: number; data: BonusProgramPageMutation },
  { rejectValue: ValidationError }
>("bonus_program/updateBonusPage", async ({ id, data }, { rejectWithValue }) => {
  try {

    await axiosApi.put(`/bonus_program/${id}`, data)

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

export const fetchBonusPage = createAsyncThunk<BonusProgramPage, void>(
  "bonus_program/fetchBonusPage",
  async () => {
    try {
      const response = await axiosApi.get<BonusProgramPage>(`/bonus_program`);
      return response.data;
    } catch (error) {
      console.error("Error fetching site data:", error);
      throw error;
    }
  },
);


