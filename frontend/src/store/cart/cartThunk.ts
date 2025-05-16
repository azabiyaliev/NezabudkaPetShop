import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi.ts';
import { CartError, ICartBack } from '../../types';
import { isAxiosError } from 'axios';

export const fetchCart = createAsyncThunk<ICartBack, void, {rejectValue: CartError}>(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
   try {
     const response = await axiosApi<ICartBack>("/cart");
     return response.data;

   } catch (error) {
     if (isAxiosError(error) && error.response && (error.response.status === 409 || error.response.status === 404 || error.response.status === 400)) {
      return rejectWithValue(error.response.data as CartError);
     }
     throw error;
   }
});

export const createCart = createAsyncThunk<void, void, { rejectValue: CartError }>(
  "cart/createCart",
  async (_, { rejectWithValue }) => {
    try {
      await axiosApi.post("/cart");
    } catch (error) {
      if (isAxiosError(error) && error.response && (error.response.status === 409 || error.response.status === 404 || error.response.status === 400)) {
        return rejectWithValue(error.response.data as CartError);
      }
      throw error;
    }
  }
);

export const addItem = createAsyncThunk<
  void,
  { cartId: number; productId: number; quantity: number },
  { rejectValue: CartError }
>(
  'cart/addItem',
  async ({ cartId, productId, quantity }, { rejectWithValue }) => {
    try {
      await axiosApi.post(`cart/${cartId}/item`, {productId, quantity});
    } catch (error) {
      if (isAxiosError(error) && error.response && (error.response.status === 409 || error.response.status === 404 || error.response.status === 400)) {
        return rejectWithValue(error.response.data as CartError);
      }
      throw error;
    }
  }
);

export const deleteItemCart = createAsyncThunk<void,
  { cartId: number; productId: number },
  { rejectValue: CartError }
>(
  "cart/deleteItemCart",
  async ({ cartId, productId }, { rejectWithValue }) => {
    try {
      await axiosApi.delete(`cart/${cartId}/item/${productId}`,);
    } catch (error) {
      if (isAxiosError(error) && error.response &&
        (error.response.status === 409 || error.response.status === 404 || error.response.status === 400)) {
        return rejectWithValue(error.response.data as CartError);
      }
      throw error;
    }
  }
);

export const deleteItemsCart = createAsyncThunk<void,
  { cartId: number; },
  { rejectValue: CartError }
>(
  "cart/deleteItemsCart",
  async ({ cartId }, { rejectWithValue }) => {
    try {
      await axiosApi.delete(`cart/${cartId}/items`,);
    } catch (error) {
      if (isAxiosError(error) && error.response &&
        (error.response.status === 409 || error.response.status === 404 || error.response.status === 400)) {
        return rejectWithValue(error.response.data as CartError);
      }
      throw error;
    }
  }
);

export const updateCartItem = createAsyncThunk<void, {cartId: number; productId: number; quantity: number;}, { rejectValue: CartError }>(
  "cart/updateCartItem",
  async ({cartId, productId, quantity}, { rejectWithValue }) => {
    try {
      await axiosApi.patch(`/cart/${cartId}/item/${productId}`, {productId, quantity});
    } catch (error) {
      if (isAxiosError(error) && error.response &&
        (error.response.status === 409 || error.response.status === 404 || error.response.status === 400)) {
        return rejectWithValue(error.response.data as CartError);
      }
      throw error;
    }
  }
);
