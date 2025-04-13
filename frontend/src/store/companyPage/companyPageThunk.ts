import { createAsyncThunk } from "@reduxjs/toolkit";
import { CompanyPage, CompanyPageMutation, ValidationError } from '../../types';
import axiosApi from "../../axiosApi.ts";
import { isAxiosError } from "axios";

export const updateCompanyPage = createAsyncThunk<
  void,
  { id: number; data: CompanyPageMutation },
  { rejectValue: ValidationError }
>("company_page/updateCompanyPage", async ({ id, data }, { rejectWithValue }) => {
  try {

    await axiosApi.put(`/my_company/${id}`, data)

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

export const fetchCompanyPage = createAsyncThunk<CompanyPage, void>(
  "company_page/fetchCompanyPage",
  async () => {
    try {
      const response = await axiosApi.get<CompanyPage>(`/my_company`);
      return response.data;
    } catch (error) {
      console.error("Error fetching site data:", error);
      throw error;
    }
  },
);


