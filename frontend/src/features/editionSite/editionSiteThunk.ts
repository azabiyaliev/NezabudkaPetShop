import { createAsyncThunk } from '@reduxjs/toolkit';
import { EditSiteMutation, GlobalError } from '../../types';
import { RootState } from '../../app/store.ts';
import axiosApi from '../../axiosApi.ts';
import { isAxiosError } from 'axios';

export const updateSite = createAsyncThunk<EditSiteMutation, {id: number, data: EditSiteMutation}, { state: RootState; ejectValue: GlobalError }>(
  'edit_site/updateSite',
  async ( {id, data} , { rejectWithValue }) => {

    try {
      const response = await axiosApi.put(`/edition_site/${id}`, data);

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
export const fetchSite = createAsyncThunk<EditSiteMutation, void>(
  "edit_site/fetchSite",
  async () => {
    try {
      const response = await axiosApi.get<EditSiteMutation[]>(`/edition_site`);
      return response.data[0];
    } catch (error) {
      console.error('Error fetching site data:', error);
      throw error;
    }
  },
);


