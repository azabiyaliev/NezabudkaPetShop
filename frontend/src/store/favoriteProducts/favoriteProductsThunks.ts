import { createAsyncThunk } from '@reduxjs/toolkit';
import { FavoritesResponse } from '../../types';
import axiosApi from '../../axiosApi.ts';

export const getFavoriteProducts = createAsyncThunk<FavoritesResponse[], void>('favoriteProducts/getFavoriteProducts', async () => {
    const response = await axiosApi<FavoritesResponse[]>('favorites');
    return response.data;
});