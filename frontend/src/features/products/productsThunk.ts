import { createAsyncThunk } from "@reduxjs/toolkit";
import { GlobalError, ProductRequest, SubcategoryWithBrand } from '../../types';
import { isAxiosError } from "axios";
import axiosApi from '../../axiosApi.ts';

export const addProduct = createAsyncThunk<
  void,
  { product: ProductRequest; token: string },
  {
    rejectValue: GlobalError;
  }
>("product/addProduct", async ({ product, token }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    const keys = Object.keys(product) as (keyof ProductRequest)[];
    keys.forEach((key) => {
      const value = product[key];
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value, value.name);
        }  else {
          formData.append(key, String(value));
        }
      }
    });
    console.log(keys)
    await axiosApi.post('products/create', formData, {headers: {'Authorization': token}});
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      (error.response.status === 409 || error.response.status === 404)
    ) {
      return rejectWithValue(error.response.data as GlobalError);
    }
    throw error;
  }
});

export const getAllProductsByCategory = createAsyncThunk<SubcategoryWithBrand[], number>('product/getAllProductsByCategory',
  async (id: number) => {
  const response = await axiosApi<SubcategoryWithBrand[]>(`products/categoryID/${id}`);
  return response.data || [];
})
