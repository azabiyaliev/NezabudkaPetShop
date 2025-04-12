import { createAsyncThunk } from '@reduxjs/toolkit';
import { FavoritesResponse } from '../../types';
import axiosApi from '../../axiosApi.ts';

export const getFavoriteProducts = createAsyncThunk<FavoritesResponse[], void>('favoriteProducts/getFavoriteProducts', async () => {
    const response = await axiosApi<FavoritesResponse[]>('favorites');
    return response.data;
});

export const addFavoriteProducts = createAsyncThunk<void, number>('favoriteProducts/addFavoriteProducts', async (id:  number) => {
  try {
    await axiosApi.post(`favorites/${id}`);
  } catch (e) {
    console.log(e)
  }
});

export const removeFavoriteProductThunk = createAsyncThunk<void, number>(
  'favoriteProducts/removeFavoriteProduct',
  async (productId) => {
    await axiosApi.delete(`/favorites/${productId}`);
  }
);