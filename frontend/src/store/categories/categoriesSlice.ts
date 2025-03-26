import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store.ts';
import { ICategories, Subcategory } from '../../types';
import {
  addNewCategory, addNewSubcategory,
  deleteCategory,
  fetchCategoriesThunk,
  fetchOneCategoryThunk, fetchSubcategories,
  updateCategoryThunk
} from './categoriesThunk.ts';

export interface categoriesState {
  Categories: ICategories[];
  oneCategory: ICategories | null;
  fetchCategories: boolean;
  SubCategories: Subcategory[];
  createSubcategoryLoading: boolean;
  isLoading: boolean;
  error: string | null;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
}

const initialState: categoriesState = {
  Categories: [],
  oneCategory: null,
  fetchCategories: false,
  SubCategories: [],
  createSubcategoryLoading: false,
  isLoading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

export const selectCategories = (state: RootState) => state.categories.Categories;
export const selectOneCategory = (state: RootState) => state.categories.oneCategory;
export const selectLoading = (state: RootState) => state.categories.isLoading;
export const selectAllSubcategories = (state: RootState) => state.categories.SubCategories;

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, {payload: category}) => {
        state.isLoading = false;
        state.Categories = category;
      })
      .addCase(fetchCategoriesThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewCategory.pending, (state) => {
        state.fetchCategories = true;
        state.createLoading = true;
      })
      .addCase(addNewCategory.fulfilled, (state) => {
        state.fetchCategories = false;
        state.createLoading = false;
      })
      .addCase(addNewCategory.rejected, (state) => {
        state.fetchCategories = false;
        state.createLoading = false;
      })
      .addCase(updateCategoryThunk.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateCategoryThunk.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(updateCategoryThunk.rejected, (state) => {
        state.updateLoading = false;
      })
      .addCase(fetchOneCategoryThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOneCategoryThunk.fulfilled, (state, {payload: oneCategory}) => {
        state.oneCategory = oneCategory;
        state.isLoading = false;
      })
      .addCase(fetchOneCategoryThunk.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.Categories = state.Categories.filter(category => category.id !== Number(action.meta.arg));
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.deleteLoading = false;
      })
      .addCase(addNewSubcategory.pending, (state) => {
        state.createSubcategoryLoading = true;
      })
      .addCase(addNewSubcategory.fulfilled, (state) => {
        state.createSubcategoryLoading = false;
      })
      .addCase(addNewSubcategory.rejected, (state) => {
        state.createSubcategoryLoading = false;
      })
      .addCase(fetchSubcategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.SubCategories = payload.map(category => ({
          title: category.title,
          parentId: null,
          subcategories: []
        }));
      })
      .addCase(fetchSubcategories.rejected, (state) => {
        state.isLoading = false;
      })
  },
});

export const categoriesReducer = categoriesSlice.reducer;
