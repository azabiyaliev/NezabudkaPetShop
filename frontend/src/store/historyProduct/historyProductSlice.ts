import { historyProduct } from '../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface historyState {
  history: historyProduct []
}

const initialState: historyState ={
  history : JSON.parse(localStorage.getItem('viewedProducts') || '[]'),
}

const historyProductSlice = createSlice({
  name:"history",
  initialState,
  reducers:{
    addProductToHistory: (state, action: PayloadAction<historyProduct>) => {
      const productIndex = state.history.findIndex(
        (product) => product.productId === action.payload.productId
      );

      if (productIndex !== -1) {
        state.history.splice(productIndex, 1);
      }
      state.history.unshift(action.payload);

      state.history = state.history.slice(0, 5);

      localStorage.setItem('viewedProducts', JSON.stringify(state.history));
    },
    clearHistory: (state) => {
      state.history = [];
      localStorage.removeItem('viewedProducts');
    },
    loadHistoryFromLocalStorage: (state) => {
      state.history = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
    },
  }
})

export const historyReducer = historyProductSlice.reducer;

export const {
  addProductToHistory,
  clearHistory,
  loadHistoryFromLocalStorage,
} = historyProductSlice.actions;
