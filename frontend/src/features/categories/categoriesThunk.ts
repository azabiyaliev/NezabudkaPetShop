import { createAsyncThunk } from '@reduxjs/toolkit';
import {CategoryMutation, ICategories} from '../../types';
import axiosApi from '../../axiosApi.ts';


export const fetchCategoriesThunk = createAsyncThunk<ICategories[], void>(
  'category/fetchCategoriesThunk',
  async () => {
    const categoriesResponse = await axiosApi<ICategories[]>('/category');

    return categoriesResponse.data || [];
  }
);

export const addNewCategory = createAsyncThunk<
    void,
    { category: CategoryMutation; token: string }
>(
    "category/addNewCategory",
    async ({ category, token }) => {
        await axiosApi.post("/category", category, {
            headers: { Authorization: token },
        });
    }
);
