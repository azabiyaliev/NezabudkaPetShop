import { createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryMutation, GlobalError, ICategories } from '../../types';
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
      console.log("Sending category data:", category);
        await axiosApi.post("/category", category, {
            headers: { Authorization: token },
        });
    }
);

export const addNewSubcategory = createAsyncThunk<
  void,
  { id: number; subcategories: string[]; token: string }
>(
  "category/addNewSubcategory",
  async ({ id, subcategories, token }) => {
    console.log("Adding subcategories to category ID:", id);

    const subcategoryData = subcategories.map(sub => ({ title: sub }));


    await axiosApi.post(`/category/${id}/subcategories`, { subcategories: subcategoryData }, {
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

export const fetchOneCategoryThunk = createAsyncThunk<
    ICategories | null,
    string,
    { rejectValue: GlobalError }
>(
    "category/fetchOneCategory",
    async (query, { rejectWithValue }) => {
        try {
            const response = await axiosApi.get<ICategories>(`/category`, {
                params: { search: query },
            });
            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                const { status, data } = error.response;

                if (status === 404 && data.error) {
                    return rejectWithValue(data as GlobalError);
                }
            }
            throw error;
        }
    }
);

export const fetchSubcategories = createAsyncThunk<
  ICategories[],
  number,
  { rejectValue: GlobalError }
>(
  "category/fetchSubcategories",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axiosApi.get<ICategories[]>(`/category/${categoryId}/subcategories`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 404 && data.error) {
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


