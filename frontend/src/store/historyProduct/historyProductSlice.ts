import { historyProduct } from '../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store.ts';

interface historyState {
  history: historyProduct []
}

const initialState: historyState ={
  history : JSON.parse(localStorage.getItem('viewedProducts') || '[]'),
}

export const historyProductsFromSlice = (state: RootState) => state.history.history;

const historyProductSlice = createSlice({
  name:"history",
  initialState,
  reducers:{
    addProductToHistory: (state, action: PayloadAction<historyProduct>) => {
      const productIndex = state.history.findIndex(
        (product) => product.productId === action.payload.productId
      );

      if (productIndex !== -1) {
        const existing = state.history.splice(productIndex, 1)[0];
        state.history.unshift(existing);
      } else {
        state.history.unshift(action.payload);
      }
      state.history = state.history.slice(0, 5);
      localStorage.setItem('viewedProducts', JSON.stringify(state.history));
    },
  }
})

export const historyReducer = historyProductSlice.reducer;

export const {
  addProductToHistory,
} = historyProductSlice.actions;
