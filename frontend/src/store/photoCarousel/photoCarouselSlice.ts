import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from "../../app/store.ts";
import { PhotoCarousel } from '../../types';
import { addNewPhoto, fetchPhoto, updatePhoto, updatePhotoOrders } from './photoCarouselThunk.ts';

interface PhotoCarouselState {
  photos: PhotoCarousel[];
  editLoading: boolean;
  editError: boolean;
  isLoading: boolean;
}

const initialState: PhotoCarouselState = {
  photos: [],
  editLoading: false,
  editError: false,
  isLoading: false,
};

export const selectPhotoCarousel = (state: RootState) => state.photo_carousel.photos;
export const selectPhotoError = (state: RootState) => state.photo_carousel.editError;

export const PhotoCarouselSlice = createSlice({
  name: "photo_carousel",
  initialState,
  reducers: {
    updatePhotoOrder: (state, action: PayloadAction<PhotoCarousel[]>) => {
      state.photos = action.payload;
    },
  },
  extraReducers: (build) => {
    build
      .addCase(updatePhoto.pending, (state) => {
        state.editLoading = true;
        state.editError = false;
      })
      .addCase(updatePhoto.fulfilled, (state) => {
        state.editLoading = false;
      })
      .addCase(updatePhoto.rejected, (state) => {
        state.editLoading = false;
        state.editError = true;
      })
      .addCase(addNewPhoto.pending, (state) => {
        state.editLoading = true;
        state.editError = false;
      })
      .addCase(addNewPhoto.fulfilled, (state) => {
        state.editLoading = false;
      })
      .addCase(addNewPhoto.rejected, (state) => {
        state.editLoading = false;
        state.editError = true;
      })
      .addCase(fetchPhoto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.photos = action.payload;
      })
      .addCase(fetchPhoto.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updatePhotoOrders.pending, (state) => {
        state.editLoading = true;
        state.editError = false;
      })
      .addCase(updatePhotoOrders.fulfilled, (state, action) => {
        state.editLoading = false;
        state.photos = action.payload;
      })
      .addCase(updatePhotoOrders.rejected, (state) => {
        state.editLoading = false;
      });
  },
});

export const { updatePhotoOrder } = PhotoCarouselSlice.actions;

export const photoCarouselReducer = PhotoCarouselSlice.reducer;
