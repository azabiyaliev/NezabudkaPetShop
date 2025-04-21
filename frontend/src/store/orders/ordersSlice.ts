import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrder, OrderStats } from '../../types';
import {
  checkoutAuthUserOrder, deleteOrder,
  getAllOrders, GetClientOrders, GetGuestOrders, getStatistics, transferGuestOrders,
  updateOrderStatus
} from './ordersThunk.ts';


interface OrderSliceState {
  orders: IOrder[];
  oneOrder: IOrder | null;
  orderStats: OrderStats | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: OrderSliceState = {
  orders: [],
  oneOrder: null,
  orderStats: null,
  isLoading: false,
  isError: false,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getAllOrders.pending, (state) => {
          state.isLoading = true;
          state.isError = false
        }
      )
      .addCase(
        getAllOrders.fulfilled, (state, action: PayloadAction<IOrder[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
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
      .addCase(
        GetClientOrders.pending, (state) => {
          state.isLoading = true;
          state.isError = false
        }
      )
      .addCase(
        GetClientOrders.fulfilled, (state, {payload: order}) => {
          state.isLoading = false;
          state.orders = order
        }
      )
      .addCase(
        GetClientOrders.rejected, (state) => {
          state.isLoading = false;
          state.isError = true;
        }
      )
      .addCase(
        GetGuestOrders.pending, (state) => {
          state.isLoading = true;
          state.isError = false
        }
      )
      .addCase(
        GetGuestOrders.fulfilled, (state, {payload: order}) => {
          state.isLoading = false;
          state.orders = order
        }
      )
      .addCase(
        GetGuestOrders.rejected, (state) => {
          state.isLoading = false;
          state.isError = true;
        }
      )
      .addCase(
        transferGuestOrders.pending, (state) => {
          state.isLoading = true;
          state.isError = false;
        }
      )
      .addCase(
        transferGuestOrders.fulfilled, (state) => {
          state.isLoading = false;
          state.isError = false;
        }
      )
      .addCase(
        transferGuestOrders.rejected, (state) => {
          state.isLoading = false;
          state.isError = true;
        }
      )
      .addCase(
        getStatistics.pending, (state) => {
          state.isLoading = true;
          state.isError = false;
        }
      )
      .addCase(
        getStatistics.fulfilled, (state, {payload: stats}) => {
          state.isLoading = false;
          state.orderStats = stats;
        }
      )
      .addCase(
        getStatistics.rejected, (state) => {
          state.isLoading = false;
          state.isError = true;
        }
      )
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
          state.isError = false
        }
      )
      .addCase(
        deleteOrder.fulfilled, (state, action) => {
          state.isLoading = false;
          state.orders = state.orders.filter((order) => String(order.id) !== action.meta.arg)
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

export const {clearOrders} = ordersSlice.actions