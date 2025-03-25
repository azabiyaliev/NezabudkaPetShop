import { createAsyncThunk } from '@reduxjs/toolkit';
import {GlobalError, IBrand, IBrandForm} from '../../types';
import axiosApi from '../../axiosApi.ts';
import {isAxiosError} from "axios";

export const addBrand = createAsyncThunk<void, {brand: IBrandForm, token: string }, {rejectValue: GlobalError}>(
  'brands/addBrand',
  async ({brand, token}, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      const keys = Object.keys(brand) as (keyof IBrandForm)[];
      keys.forEach((key) => {
        const value = brand[key];

        if (value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value, value.name);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      await axiosApi.post('/brands', formData, {headers: {'Authorization': token}});
    } catch (error) {
      if (isAxiosError(error) && error.response && (error.response.status === 409 || error.response.status === 404)) {
        return rejectWithValue(error.response.data as GlobalError);
      }
      throw error;
    }
  },
);

export const editBrand = createAsyncThunk<void, {brand: IBrandForm, token: string }>(
  'brands/editBrand',
  async ({brand, token}) => {
    const formData = new FormData();

    const keys = Object.keys(brand) as (keyof IBrand)[];

    keys.forEach((key) => {
      const value = brand[key];

      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    await axiosApi.put(`/brands/${brand.id}`, formData, {headers: {'Authorization': token}});
  },
);

export const getBrands = createAsyncThunk(
  'brands/fetchAllBrands',
  async () => {
    const response = await axiosApi<IBrand[]>('/brands/');

    return response.data || [];
  }
);

export const getOneBrand = createAsyncThunk<IBrandForm, number>(
  'brands/getOneBrand',
  async (brandId) => {
    const response = await axiosApi.get<IBrandForm>(`/brands/${brandId}`);
    return response.data || null;
  }
);

export const brandeDelete = createAsyncThunk<void, { brandId: number; token: string }>(
  'brands/brandeDelete',
  async ({ brandId, token }) => {
  await axiosApi.delete(`/brands/${brandId}`, {headers: { Authorization: token }});
});





