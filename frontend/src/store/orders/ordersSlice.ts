import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrder, OrderStats } from '../../types';
import {
  checkoutAuthUserOrder, deleteOrder,
  getAllOrders, GetMyOrders, getStatistics,
  updateOrderStatus
} from './ordersThunk.ts';

export interface Pagination {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

interface OrderSliceState {
  paginationOrders: {
    data: IOrder[];
    meta: Pagination;
  } | null;
  orders: IOrder[];
  oneOrder: IOrder | null;
  orderStats: OrderStats | null;
  isLoading: boolean;
  isError: boolean;
}

const initialState: OrderSliceState = {
  orders: [],
  paginationOrders: null,
  oneOrder: null,
  orderStats: null,
  isLoading: false,
  isError: false,
}

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
        getAllOrders.fulfilled, (state, action: PayloadAction<{ data: IOrder[]; meta: Pagination }>) => {
          state.isLoading = false;
          state.orders = action.payload.data;
          state.paginationOrders = action.payload;
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
        GetMyOrders.pending, (state) => {
          state.isLoading = true;
          state.isError = false
        }
      )
      .addCase(
        GetMyOrders.fulfilled, (state, {payload: order}) => {
          state.isLoading = false;
          state.orders = order
        }
      )
      .addCase(
        GetMyOrders.rejected, (state) => {
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