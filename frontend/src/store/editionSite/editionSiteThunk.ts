import { createAsyncThunk } from "@reduxjs/toolkit";
import { EditSite, EditSiteMutation, ValidationError } from '../../types';
import axiosApi from "../../axiosApi.ts";
import { isAxiosError } from "axios";

export const updateSite = createAsyncThunk<
  void,
  { id: number; data: EditSiteMutation },
  { rejectValue: ValidationError }
>("edit_site/updateSite", async ({ id, data }, { rejectWithValue }) => {
  try {

    await axiosApi.put(`/edition_site/${id}`, data)

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

export const fetchSite = createAsyncThunk<EditSite, void>(
  "edit_site/fetchSite",
  async () => {
    try {
      const response = await axiosApi.get<EditSite>(`/edition_site`);
      return response.data;
    } catch (error) {
      console.error("Error fetching site data:", error);
      throw error;
    }
  },
);
