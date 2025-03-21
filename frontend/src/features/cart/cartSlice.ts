import { createSlice } from '@reduxjs/toolkit';
import { ICart } from '../../types';

interface CartSliceInterface {
  carts: ICart[];
  loadings: {
    addLoading: boolean;
    getLoading: boolean;
    deleteLoading: boolean;
    updateLoading: boolean;
  };
  error: boolean;
}

const initialState:CartSliceInterface = {
  carts: [],
  loadings: {
    addLoading: false,
    getLoading: false,
    deleteLoading: false,
    updateLoading: false,
  },
  error: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {}
});

export const cartReducer = cartSlice.reducer;