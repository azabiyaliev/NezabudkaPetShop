import { createAsyncThunk } from '@reduxjs/toolkit';
import { EditSiteMutation, GlobalError, SiteMutation } from '../../types';
import { RootState } from '../../app/store.ts';
import axiosApi from '../../axiosApi.ts';
import { isAxiosError } from 'axios';

export const updateSite = createAsyncThunk<EditSiteMutation, {id: number, data: Partial<EditSiteMutation>}, { state: RootState; ejectValue: GlobalError }>(
  'edit_site/updateSite',
  async ( {id, data} , { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.users.user?.token;

    if (!token) {
      return rejectWithValue({ error: 'No token provided' });
    }

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

export const fetchSiteById = createAsyncThunk<SiteMutation, string>(
  "edit_site/fetchSiteById",
  async (siteId: string) => {
    try {
      const response = await axiosApi.get<SiteMutation>(`/edition_site/${siteId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching site data:', error);
      throw error;
    }
  },
);