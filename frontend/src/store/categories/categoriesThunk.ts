import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  CategoryMutation,
  GlobalError,
  ICategories,
  Subcategory,
} from "../../types";
import axiosApi from "../../axiosApi.ts";
import { isAxiosError } from "axios";

export const fetchCategoriesThunk = createAsyncThunk<ICategories[], void>(
  "category/fetchCategoriesThunk",
  async () => {
    const categoriesResponse = await axiosApi<ICategories[]>("/category");

    return categoriesResponse.data || [];
  },
);

export const addNewCategory = createAsyncThunk<
  void,
  { category: CategoryMutation; token: string }
>("category/addNewCategory", async ({ category, token }) => {
  await axiosApi.post("/category", category, {
    headers: { Authorization: token },
  });
});

export const addNewSubcategory = createAsyncThunk<
  void,
  { id: number; subcategories: string[]; token: string }
>(
  "category/addNewSubcategory",
  async ({ id, subcategories, token }, { rejectWithValue }) => {
    try {
      const subcategoryData = subcategories.map((sub) => ({ title: sub }));
      await axiosApi.post(
        `/category/${id}/subcategories`,
        { subcategories: subcategoryData },
        {
          headers: { Authorization: token },
        },
      );
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateCategoryThunk = createAsyncThunk<
  void,
  {
    id: string;
    category: { title: string; subcategories?: Subcategory[] };
    token: string;
  }
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
  },
);

export const updateCategoriesThunk = createAsyncThunk<
  void,
  ICategories[]
>('category/updateCategories', async (categories, { rejectWithValue }) => {
  try {
    for (const category of categories) {
      if (category.subcategories) {
        for (const subcategory of category.subcategories) {
          await axiosApi.put(`/category/${subcategory.id}`, {
            title: subcategory.title,
            parentId: category.id,
          });
        }
      }
    }
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateSubcategoryThunk = createAsyncThunk<
  void,
  {
    id: number;
    parentId: number;
    subcategory: { title: string };
    token: string;
  }
>(
  'category/updateSubcategory',
  async ({ id, parentId, subcategory, token }, { rejectWithValue }) => {
    try {
      await axiosApi.put(`/category/${id}`, {
        ...subcategory,
        parentId,
      }, {
        headers: { Authorization: token },
      });
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);


export const fetchOneCategoryThunk = createAsyncThunk<
  ICategories | null,
  string,
  { rejectValue: GlobalError }
>("category/fetchOneCategory", async (query, { rejectWithValue }) => {
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
});

export const fetchSubcategories = createAsyncThunk<
  ICategories[],
  number,
  { rejectValue: GlobalError }
>("category/fetchSubcategories", async (categoryId, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get<ICategories[]>(
      `/category/${categoryId}/subcategories`,
    );
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
});

export const deleteCategory = createAsyncThunk<void, string>(
  "category/deleteCategory",
  async (id) => {
    await axiosApi.delete(`/category/${id}`);
  },
);
