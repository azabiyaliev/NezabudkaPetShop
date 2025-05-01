import { createAsyncThunk } from '@reduxjs/toolkit';
import { PhotoCarousel, PhotoForm } from '../../types';
import axiosApi from '../../axiosApi.ts';

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
  PhotoForm
>("brands/addBrand", async (photo) => {
  try {
    const formData = new FormData();
    if (photo.photo instanceof File) {
      formData.append("photo", photo.photo, photo.photo.name);
    }
    formData.append("link", photo.link);
    formData.append("title", photo.title);
    formData.append("description", photo.description);

    await axiosApi.post("/photos", formData);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const updatePhoto = createAsyncThunk<
  void,
  { photo: PhotoCarousel }
>("photo_carousel/updatePhoto", async ({ photo }) => {
  try {
    const data = new FormData();

    if (photo.photo instanceof File) {
      data.append("photo", photo.photo, photo.photo.name);
    }

    if (photo.link) {
      data.append("link", photo.link);
    }

    if (photo.title) {
      data.append("title", photo.title);
    }
    if (photo.description) {
      data.append("description", photo.description);
    }
    await axiosApi.put(`/photos/${photo.id}`, data);

  } catch (error) {
    console.error(error);
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