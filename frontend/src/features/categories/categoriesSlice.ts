import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../app/store.ts';
import {ICategories} from '../../types';
import {addNewCategory, fetchCategoriesThunk} from './categoriesThunk.ts';

export interface categoriesState {
    Categories: ICategories[];
    fetchCategories: boolean;
    isLoading: boolean;
    error: string | null;
    createLoading: boolean;
}

const initialState: categoriesState = {
    Categories: [],
    fetchCategories: false,
    isLoading: false,
    error: null,
    createLoading: false,
};

export const selectCategories = (state: RootState) => state.categories.Categories;

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
    },
});

export const categoriesReducer = categoriesSlice.reducer;
