import { createAsyncThunk } from '@reduxjs/toolkit';
import { ICategories } from '../../types';
import axiosApi from '../../axiosApi.ts';


export const fetchCategoriesThunk = createAsyncThunk<ICategories[], void>(
  'category/fetchCategoriesThunk',
  async () => {
    const categoriesResponse = await axiosApi<ICategories[]>('/category');

    return categoriesResponse.data || [];
  }
);
