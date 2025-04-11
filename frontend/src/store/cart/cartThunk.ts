import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import {CartError, ICartBack} from "../../types";
import {isAxiosError} from "axios";

export const fetchCart = createAsyncThunk<ICartBack, { token?: string, anonymousCartId?: string }, {rejectValue: CartError}>(
  "cart/fetchCart",
  async ({token, anonymousCartId}, { rejectWithValue }) => {
   try {
     const config = {
       headers: token ? { Authorization: token } : {},
       params: { anonymousCartId },
     };

       const response = await axiosApi<ICartBack>('/cart', config);

       return response.data;
   } catch (error) {
       if (isAxiosError(error) && error.response && (error.response.status === 409 || error.response.status === 404 || error.response.status === 400)) {
           return rejectWithValue(error.response.data as CartError);
       }
       throw error;
   }
});

export const createCart = createAsyncThunk<void, { token?: string, anonymousCartId?: string }, { rejectValue: CartError }>(
  "cart/createCart",
  async ({ token, anonymousCartId }, { rejectWithValue }) => {
    try {
      const headers = token ? { Authorization: token } : {};
      const body = token ? {} : { anonymousCartId };
      await axiosApi.post("/cart", body, { headers });
    } catch (error) {
      if (isAxiosError(error) && error.response && (error.response.status === 409 || error.response.status === 404 || error.response.status === 400)) {
        return rejectWithValue(error.response.data as CartError);
      }
      throw error;
    }
  }
);