import {createAsyncThunk} from "@reduxjs/toolkit";
import {ICart, ICartMutation} from "../../types";
import axiosApi from "../../axiosApi.ts";

export const addCart = createAsyncThunk<void, ICartMutation>(
  'cart/addCart',
  async (cart) => {
    await axiosApi.post('/cart', cart);
  }
);

export const editCart = createAsyncThunk<void, ICart>(
  'cart/editCart',
   async (cart) => {
      await axiosApi.put(`/cart/${cart.id}`, cart);
   }
);

export const getCart = createAsyncThunk<ICart[], void>(
  'cart/getCart',
  async () => {
    const response = await axiosApi('/cart');
    return response.data;
  }
);

export const cartDelete = createAsyncThunk<void, number>(
  'cart/cartDelete',
  async (id) => {
    await axiosApi.delete(`/cart/${id}`);
});
