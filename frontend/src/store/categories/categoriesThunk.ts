import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  CategoryMutation,
  GlobalError,
  ICategories, ICategoriesMutation,
  Subcategory,
} from '../../types';
import axiosApi from "../../axiosApi.ts";
import { isAxiosError } from "axios";

export const fetchCategoriesThunk = createAsyncThunk<ICategories[], void>(
  "category/fetchCategoriesThunk",
  async () => {
    try{
      const categoriesResponse = await axiosApi.get<ICategories[]>("/category/");
      return categoriesResponse.data || [];
    }catch(error){
      console.log(error);
      throw error;
    }
  },
);

export const addIconToCategoryThunk = createAsyncThunk<
  { icon: string },
  { id: number; iconFile: File; },
  { rejectValue: GlobalError }
>(
  "category/addIconToCategory",
  async ({ id, iconFile }, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("icon", iconFile);

    try {
      const response = await axiosApi.patch(
        `/category/${id}/icon`,
        formData,
      );

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const addImageToCategoryThunk = createAsyncThunk<
  { image: string },
  { id: number; imageFile: File; },
  { rejectValue: GlobalError }
>(
  "category/addImageToCategoryThunk",
  async ({ id, imageFile }, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axiosApi.patch(
        `/category/${id}/image`,
        formData,
      );

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);

export const addNewCategory = createAsyncThunk<
  void,
  { category: CategoryMutation; token: string }
>("category/addNewCategory", async ({ category, token }, { rejectWithValue }) => {
  const formData = new FormData();

  // Добавляем все поля для категории
  formData.append("title", category.title);
  if (category.parentId) formData.append("parentId", category.parentId.toString());

  // Добавляем файлы
  if (category.icon) formData.append("icon", category.icon);
  if (category.image) formData.append("image", category.image);

  try {
    // Отправляем запрос с FormData
    await axiosApi.post("/category", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      if (status === 404 || status === 401) {
        return rejectWithValue(data as GlobalError);
      }
    }
    throw error;
  }
});


export const addNewSubcategory = createAsyncThunk<
  void,
  { id: number; subcategories: string[]; token: string }
>(
  "category/addNewSubcategory",
  async ({ id, subcategories, token }, { rejectWithValue }) => {
    const formData = new FormData();

    // Подготовим подкатегории
    subcategories.forEach((sub) => formData.append("subcategories[]", sub));

    try {
      // Отправляем запрос с подкатегориями
      await axiosApi.post(
        `/category/${id}/subcategories`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 404 || status === 401) {
          return rejectWithValue(data as GlobalError);
        }
      }
      throw error;
    }
  }
);


export const updateCategoryThunk = createAsyncThunk<
  void,
  {
    id: string;
    category: CategoryMutation;
    token: string;
  }
>(
  "category/updateCategory",
  async ({ id, category, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", category.title);

      if (category.icon instanceof File) {
        formData.append("icon", category.icon);
      } else if (category.icon === null) {
        formData.append("icon", '');
      }

      if (category.image instanceof File) {
        formData.append("image", category.image);
      } else if (category.image === null) {
        formData.append("image", '');
      }

      await axiosApi.put(`/category/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if ((status === 404 || status === 401) && data.error) {
          return rejectWithValue(data as GlobalError);
        }
      }
      throw error;
    }
  },
);

export const updateSubcategoryThunk = createAsyncThunk<
  void,
  {
    id: number;
    parentId?: number;
    subcategory: { title: string };
    token: string;
  }
>(
  'category/updateSubcategory',
  async ({ id, parentId, subcategory, token }, { rejectWithValue }) => {
    try {
      const dataToSend = {
        ...subcategory,
        ...(parentId !== undefined && { parentId }),
      };
      await axiosApi.put(`/category/${id}`, dataToSend, {
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
  ICategoriesMutation | null,
  string,
  { rejectValue: GlobalError }
>("category/fetchOneCategory", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get<ICategoriesMutation>(`/category/${id}`,);
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

export const updateSubcategoryParentThunk = createAsyncThunk<
  void,
  { subcategoryId: number; newParentId: number | null; token: string },
  { rejectValue: GlobalError }
>(
  'category/updateSubcategoryParent',
  async ({ subcategoryId, newParentId, token }, { rejectWithValue }) => {
    try {
      await axiosApi.put(
        `/category/${subcategoryId}/parent`,
        { parentId: newParentId },
        {
          headers: { Authorization: token },
        },
      );
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as GlobalError);
      }
      throw error;
    }
  },
);

export const deleteCategory = createAsyncThunk<void, string>(
  "category/deleteCategory",
  async (id) => {
    await axiosApi.delete(`/category/${id}`);
  },
);
