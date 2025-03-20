import { createAsyncThunk } from '@reduxjs/toolkit';
import { EditSite, EditSiteMutation, ValidationError } from '../../types';
import axiosApi from '../../axiosApi.ts';
import { isAxiosError } from 'axios';

export const updateSite = createAsyncThunk<
  void,
  { id: number; site: EditSiteMutation },
  { rejectValue: ValidationError }
>(
  'edit_site/updateSite',
  async ({ id, site }, { rejectWithValue }) => {
    try {
      const data = new FormData();
      data.append('instagram', site.instagram);
      data.append('whatsapp', site.whatsapp);
      data.append('schedule', site.schedule);
      data.append('address', site.address);
      data.append('email', site.email);
      data.append('phone', site.phone);

      site.PhotoByCarousel.forEach((photo) => {
        if (photo.photo) {
          data.append(`PhotoByCarousel`, photo.photo);
        }
      });
      await axiosApi.put(`/edition_site/${id}`, data);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const { data, status } = error.response;
        if ([400, 401, 409].includes(status)) {
          const formattedErrors = typeof data.errors === "object"
            ? data.errors
            : { general: data.message };
          return rejectWithValue({ errors: formattedErrors } as ValidationError);
        }
      }
      throw error;
    }
  }
);

export const fetchSite = createAsyncThunk<EditSite, void>(
  "edit_site/fetchSite",
  async () => {
    try {
      const response = await axiosApi.get<EditSite>(`/edition_site`);
      return response.data;
    } catch (error) {
      console.error('Error fetching site data:', error);
      throw error;
    }
  },
);


