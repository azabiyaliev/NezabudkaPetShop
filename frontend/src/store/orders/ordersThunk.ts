import { createAsyncThunk } from '@reduxjs/toolkit';
import { IOrder, OrderMutation, OrderStats } from '../../types';
import axiosApi from '../../axiosApi.ts';
import { RootState } from '../../app/store.ts';
import { Pagination } from './ordersSlice.ts';

export const getAllOrders = createAsyncThunk<{ data: IOrder[], meta: Pagination }, number | undefined, { state: RootState }>(
  'orders/getAllOrders',
  async (page, { getState }) => {
    const token = getState().users.user?.token;

    const url = page !== undefined
      ? `/orders/all-orders?page=${page}&limit=10`
      : `/orders/all-orders`;

    const response = await axiosApi.get(url, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  }
);

export const GetClientOrders = createAsyncThunk<IOrder[], void, { state: RootState }>(
  'orders/getUserOrders',
  async (_, { getState }) => {
    const token = getState().users.user?.token;
    const response = await axiosApi.get('orders/client-orders', {
      headers: { Authorization: token },
    });
    return response.data.orders;
  }
);

export const GetGuestOrders = createAsyncThunk<IOrder[], string>(
  'orders/getGuestOrders',
  async (guestEmail) => {
    const response = await axiosApi.get(`orders/guest-orders?guestEmail=${guestEmail}`);
    return response.data || [];
  }
);

export const transferGuestOrders = createAsyncThunk<OrderMutation, string, {state: RootState}>(
  'orders/transfer',
  async (guestEmail: string, { getState }) => {
    const token = getState().users.user?.token;
    const response = await axiosApi.post(
      'orders/transfer-guest-orders',
      { guestEmail },
      { headers: { Authorization: token} }
    );
    return response.data;
  }
);

export const getStatistics = createAsyncThunk<OrderStats, void, {state:RootState}>(
  'orders/getStatistics',
  async(_, {getState}) => {
    const token = getState().users.user?.token;
    const response = await axiosApi.get('orders/statistics', {headers: {Authorization: token}});
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
       await axiosApi.post('orders/checkout', order, {
          headers: {
            Authorization: token
          }
        })
      } else if(!token) {
        await axiosApi.post('orders/guest-checkout', order);
        localStorage.setItem('guestEmail', order.guestEmail);
      }
    } catch(e) {
      console.log('Ошибка оформления заказа:', e);
    }
  }
)

export const updateOrderStatus = createAsyncThunk<
  IOrder,
  { orderId: string; updatedStatus: string },
  { state: RootState }
>(
  'orders/updateOrderStatus',
  async({ orderId, updatedStatus }, {getState}) => {
    const token = getState().users.user?.token;
    const response = await axiosApi.patch<IOrder>(`orders/${orderId}`, {status: updatedStatus}, {
      headers: {
        Authorization: token
      },
    });
    return response.data;
  }
)

export const deleteOrder = createAsyncThunk<void, string, {state: RootState}>(
  'orders/deleteOrder',
  async(orderId, {getState}) => {
    const token = getState().users.user?.token;
    await axiosApi.delete(`orders/${orderId}`, {headers: {Authorization: token}});
  }
)