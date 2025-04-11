import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import {CartError, ICartBack} from "../../types";
import {isAxiosError} from "axios";

export const fetchCart = createAsyncThunk<ICartBack, {token: string }, {rejectValue: CartError}>(
  "cart/fetchCart",
  async ({token}, { rejectWithValue }) => {
   try {
     const response = await axiosApi<ICartBack>('/cart', {headers: { Authorization: token }});
     return response.data;
   } catch (error) {
     if (isAxiosError(error) && error.response && (error.response.status === 409 || error.response.status === 404 || error.response.status === 400)) {
      return rejectWithValue(error.response.data as CartError);
     }
     throw error;
   }
});

export const createCart = createAsyncThunk<void, {token: string }, { rejectValue: CartError }>(
  "cart/createCart",
  async (token, { rejectWithValue }) => {
    try {
      await axiosApi.post("/cart", {headers: { Authorization: token }});
    } catch (error) {
      if (isAxiosError(error) && error.response && (error.response.status === 409 || error.response.status === 404 || error.response.status === 400)) {
        return rejectWithValue(error.response.data as CartError);
      }
      throw error;
    }
  }
);

export const deleteCart = createAsyncThunk<void, {cartId: number, token: string}, { rejectValue: CartError }>(
  "cart/deleteCart",
  async ({cartId, token}, { rejectWithValue }) => {
    try {
      await axiosApi.delete(`/cart/${cartId}`, {headers: { Authorization: token }});
    }  catch (error) {
      if (isAxiosError(error) && error.response && (error.response.status === 409 || error.response.status === 404 || error.response.status === 400)) {
        return rejectWithValue(error.response.data as CartError);
      }
      throw error;
    }
  }
);

export const addItem = createAsyncThunk<
  void,
  { cartId: number; productId: number; quantity: number; token: string },
  { rejectValue: CartError }
>(
  'cart/addItem',
  async ({ cartId, productId, quantity, token }, { rejectWithValue }) => {
    try {
      await axiosApi.post(`cart/${cartId}/item`, {productId, quantity}, {headers: { Authorization: token }});
    } catch (error) {
      if (isAxiosError(error) && error.response && (error.response.status === 409 || error.response.status === 404 || error.response.status === 400)) {
        return rejectWithValue(error.response.data as CartError);
      }
      throw error;
    }
  }
);

export const deleteItemCart = createAsyncThunk<void,
  { cartId: number; productId: number; token: string },
  { rejectValue: CartError }
>(
  "cart/deleteItemCart",
  async ({ cartId, productId, token }, { rejectWithValue }) => {
    try {
      await axiosApi.delete(`cart/${cartId}/item/${productId}`, {headers: { Authorization: token }});
    } catch (error) {
      if (isAxiosError(error) && error.response &&
        (error.response.status === 409 || error.response.status === 404 || error.response.status === 400)) {
        return rejectWithValue(error.response.data as CartError);
      }
      throw error;
    }
  }
);


