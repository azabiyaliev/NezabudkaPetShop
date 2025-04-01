import { createAsyncThunk } from "@reduxjs/toolkit";
import { GlobalError, IBrand, IBrandForm } from "../../types";
import axiosApi from "../../axiosApi.ts";
import { isAxiosError } from "axios";

export const addBrand = createAsyncThunk<
  void,
  { brand: IBrandForm; token: string },
  { rejectValue: GlobalError }
>("brands/addBrand", async ({ brand, token }, { rejectWithValue }) => {
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

    await axiosApi.post("/brands", formData, {
      headers: { Authorization: token },
    });
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

export const editBrand = createAsyncThunk<void, {brand: IBrandForm, token: string }, {rejectValue: GlobalError}>(
  'brands/editBrand',
  async ({brand, token}, {rejectWithValue}) => {
    try {
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

      await axiosApi.patch(`/brands/${brand.id}`, formData, {headers: {'Authorization': token}});
    } catch (error) {
      if (isAxiosError(error) && error.response && (error.response.status === 409 || error.response.status === 404)) {
        return rejectWithValue(error.response.data as GlobalError);
      }
      throw error;
    }
  },
);

export const getBrands = createAsyncThunk<IBrand[], void>(
  'brands/fetchAllBrands',
  async () => {
    const response = await axiosApi.get('/brands/');
    return response.data || [];
  }
);

export const getOneBrand = createAsyncThunk<IBrandForm, number, {rejectValue: GlobalError}>(
  'brands/getOneBrand',
  async (brandId, {rejectWithValue}) => {
    try {
      const response = await axiosApi.get(`/brands/${brandId}`);
      return response.data || null;
    } catch (error) {
      if (isAxiosError(error) && error.response && (error.response.status === 409 || error.response.status === 404)) {
        return rejectWithValue(error.response.data as GlobalError);
      }
      throw error;
    }
  }
);

export const brandeDelete = createAsyncThunk<void, {brandId: number; token: string}, {rejectValue: GlobalError}>(
  'brands/brandeDelete',
  async ({brandId, token}, {rejectWithValue}) => {
    try {
      await axiosApi.delete(`/brands/${brandId}`, {headers: { Authorization: token }});
    } catch (error) {
      if (isAxiosError(error) && error.response && (error.response.status === 409 || error.response.status === 404)) {
        return rejectWithValue(error.response.data as GlobalError);
      }
      throw error;
    }
});
