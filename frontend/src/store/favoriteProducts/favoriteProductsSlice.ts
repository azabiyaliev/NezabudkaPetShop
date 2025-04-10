import { createSlice } from "@reduxjs/toolkit";
import { getFavoriteProducts } from "./favoriteProductsThunks.ts";
import { FavoritesResponse } from '../../types';
import { RootState } from '../../app/store.ts';

interface IFavorites {
  favorites: FavoritesResponse[];
  isLoading: boolean;
}

const initialState: IFavorites = {
  favorites: [],
  isLoading: false,
};

export const selectedFavorite = (state: RootState) => state.favorites.favorites;

const favoriteProductsSlice = createSlice({
  name: "favoriteProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFavoriteProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFavoriteProducts.fulfilled, (state, {payload: favorite} ) => {
        state.favorites = favorite;
        state.isLoading = true;
      })
      .addCase(getFavoriteProducts.rejected, (state) => {
        state.isLoading = true;
      });
  },
});

export const favoriteProductsReducer = favoriteProductsSlice.reducer;
