import { createAsyncThunk } from '@reduxjs/toolkit';
import {CategoryMutation, GlobalError, ICategories} from '../../types';
import axiosApi from '../../axiosApi.ts';
import {isAxiosError} from "axios";


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

export const updateCategoryThunk = createAsyncThunk<
    void,
    { id: string; category: { title: string }; token: string }
>(
    "category/updateCategory",
    async ({ id, category, token }, { rejectWithValue }) => {
        try {
            await axiosApi.put(`/category/${id}`, category, {
                headers: { Authorization: token },
            });
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                const { status, data } = error.response;

                if (status === 404 && data.error) {
                    return rejectWithValue(data as GlobalError);
                }

                if (status === 401 && data.error) {
                    return rejectWithValue(data as GlobalError);
                }
            }
            throw error;
        }
    }
);

export const deleteCategory = createAsyncThunk<void, string>(
    'category/deleteCategory',
    async (id)=> {
        await axiosApi.delete(`/category/${id}`);
    }
);
