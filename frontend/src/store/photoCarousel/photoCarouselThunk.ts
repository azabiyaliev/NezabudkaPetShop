import { createAsyncThunk } from '@reduxjs/toolkit';
import { PhotoCarousel, PhotoForm, ValidationError } from '../../types';
import axiosApi from '../../axiosApi.ts';
import { isAxiosError } from 'axios';

export const fetchPhoto = createAsyncThunk<PhotoCarousel[], void>(
  "photo_carouse/fetchPhoto",
  async () => {
    try {
      const response = await axiosApi.get<PhotoCarousel[]>(`/photos`);
      return response.data;
    } catch (error) {
      console.error("Error fetching site data:", error);
      throw error;
    }
  },
)

export const addNewPhoto = createAsyncThunk<
  void,
  PhotoForm,
  { rejectValue: ValidationError }
>("brands/addBrand", async (photo, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    if (photo.photo instanceof File) {
      formData.append("photo", photo.photo, photo.photo.name);
    }
    formData.append("link", photo.link);

    await axiosApi.post("/photos", formData);
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

export const updatePhoto = createAsyncThunk<
  void,
  { photo: PhotoCarousel },
  { rejectValue: ValidationError }
>("photo_carousel/updatePhoto", async ({ photo }, { rejectWithValue }) => {
  try {
    const data = new FormData();

    if (photo.photo instanceof File) {
      data.append("photo", photo.photo, photo.photo.name);
    }

    data.append("link", photo.link);
    data.append("order", String(photo.order));

    await axiosApi.put(`/photos/${photo.id}`, data);

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


export const updatePhotoOrders = createAsyncThunk<
  PhotoCarousel[],
  PhotoCarousel[],
  { rejectValue: string }
>(
  'photo_carousel/updatePhotoOrders',
  async (photos) => {
    try {
      const response = await axiosApi.patch('/photos', photos);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const deletePhoto = createAsyncThunk<
  void,
  { id: number }
>("photo_carousel/deletePhoto", async ( { id }) => {
  try {
    await axiosApi.delete(`/photos/${id}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
})