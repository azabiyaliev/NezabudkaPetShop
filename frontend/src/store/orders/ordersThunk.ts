import { createAsyncThunk } from '@reduxjs/toolkit';
import { IOrder, OrderMutation, OrderStats } from '../../types';
import axiosApi from '../../axiosApi.ts';
import { RootState } from '../../app/store.ts';
import { Pagination } from './ordersSlice.ts';

export const getAllOrders = createAsyncThunk<{ data: IOrder[], meta: Pagination }, number>(
  'orders/getAllOrders',
  async (page) => {
    const response = await axiosApi.get(`/orders/all-orders?page=${page}&limit=10`, {
    });
    return response.data;
  }
);

export const GetMyOrders = createAsyncThunk<IOrder[], string, {state: RootState}>(
  'orders/getMyOrders',
  async (email, {getState}) => {
    try {
      const token = getState().users.user?.token;
      if(token) {
        const response = await axiosApi.get('orders/my-orders');
        return response.data;
      } else {
        const response = await axiosApi.get(`orders/guest-orders?email=${email}`);
        return response.data;
      }
    } catch(e) {
      console.log(e)
    }
  }
)

export const getStatistics = createAsyncThunk<OrderStats, void>(
  'orders/getStatistics',
  async () => {
    const response = await axiosApi.get('orders/statistics');
    return response.data;
  }
)

export const checkoutAuthUserOrder = createAsyncThunk<void, OrderMutation, {state: RootState}>(
  'orders/checkoutAuthUserOrder',
  async(order, {getState, }) => {
    try {
      const token = getState().users.user?.token;
      console.log('Отправка заказа:', order);
      if (token) {
       await axiosApi.post('orders/checkout', order)
      } else if(!token) {
        await axiosApi.post('orders/guest-checkout', order);
      }
    } catch(e) {
      console.log('Ошибка оформления заказа:', e);
    }
  }
)

export const updateOrderStatus = createAsyncThunk<
  IOrder,
  { orderId: number; updatedStatus: OrderMutation },
  { state: RootState }
>(
  'orders/updateOrderStatus',
  async({ orderId, updatedStatus }) => {
    const response = await axiosApi.patch<IOrder>(`orders/${orderId}`, updatedStatus,);
    return response.data;
  }
)