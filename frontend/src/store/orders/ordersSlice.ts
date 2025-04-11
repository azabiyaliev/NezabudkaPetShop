import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrder } from '../../types';
import {
  checkoutAuthUserOrder,
  deleteOrder,
  getAllOrders,
  updateOrderStatus
} from './ordersThunk.ts';
import { RootState } from '../../app/store.ts';

interface OrderSliceState {
  orders: IOrder[];
  oneOrder: IOrder | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: OrderSliceState = {
  orders: [],
  oneOrder: null,
  isLoading: false,
  isError: false,
}

export const selectOrder = (state: RootState) => state.orders.oneOrder

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getAllOrders.pending, (state) => {
          state.isLoading = true;
          state.isError = false
        }
      )
      .addCase(
        getAllOrders.fulfilled, (state, { payload: order }) => {
          state.isLoading = false;
          state.orders = order;
        }
      )
      .addCase(
        getAllOrders.rejected, (state) => {
          state.isLoading = false;
          state.isError = true;
        }
      )
      .addCase(
        checkoutAuthUserOrder.pending, (state) => {
          state.isLoading = true;
          state.isError = false;
        }
      )
      .addCase(
        checkoutAuthUserOrder.fulfilled, (state) => {
          state.isLoading = false
        }
      )
      .addCase(
        checkoutAuthUserOrder.rejected, (state) => {
          state.isLoading = false;
          state.isError = true;
        }
      )
      // .addCase(
      //   checkoutGuestOrder.pending, (state) => {
      //     state.isLoading = true;
      //     state.isError = false;
      //   }
      // )
      // .addCase(
      //   checkoutGuestOrder.fulfilled, (state) => {
      //     state.isLoading = false
      //   }
      // )
      // .addCase(
      //   checkoutGuestOrder.rejected, (state) => {
      //     state.isLoading = false;
      //     state.isError = true;
      //   }
      // )
      .addCase(
        updateOrderStatus.pending, (state) => {
          state.isLoading = true;
          state.isError = false
        }
      )
      .addCase(
        updateOrderStatus.fulfilled, (state, action: PayloadAction<IOrder>) => {
          state.isLoading = false;
          state.oneOrder = action.payload
        }
      )
      .addCase(
        updateOrderStatus.rejected, (state) => {
          state.isLoading = false;
          state.isError = true;
        }
      )
      .addCase(
        deleteOrder.pending, (state) => {
          state.isLoading = true;
          state.isError = false;
        }
      )
      .addCase(
        deleteOrder.fulfilled, (state, action) => {
          state.isLoading = false;
          state.orders = state.orders.filter((order) => order.id !== Number(action.meta.arg))
        }
      )
      .addCase(
        deleteOrder.rejected, (state) => {
          state.isLoading = false;
          state.isError = true;
        }
      )
  }
})

export const orderReducer = ordersSlice.reducer