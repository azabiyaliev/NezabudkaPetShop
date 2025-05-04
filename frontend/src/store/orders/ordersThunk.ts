import { createAsyncThunk } from '@reduxjs/toolkit';
import { IOrder, OrderMutation, OrderStats } from '../../types';
import axiosApi from '../../axiosApi.ts';
import { RootState } from '../../app/store.ts';
import { isAxiosError } from 'axios';

export const getAllOrders = createAsyncThunk<IOrder[], void>(
  'orders/getAllOrders',
  async () => {
    const response = await axiosApi.get("/orders/all-orders");
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

export const getStatistics = createAsyncThunk<OrderStats, void>(
  'orders/getStatistics',
  async () => {
    const response = await axiosApi.get('orders/statistics');
    return response.data;
  }
)

export const checkoutAuthUserOrder = createAsyncThunk<void, OrderMutation, {state: RootState}>(
  'orders/checkoutAuthUserOrder',
  async(order, {getState, rejectWithValue
   }) => {
    try {
      const token = getState().users.user?.token;
      console.log('Отправка заказа:', order);
      if (token) {
       await axiosApi.post('orders/checkout', {...order, recaptchaToken: order.recaptchaToken})
      } else if(!token) {
        await axiosApi.post('orders/guest-checkout', {...order, recaptchaToken: order.recaptchaToken});
        localStorage.setItem('guestEmail', order.guestEmail);
      }
    } catch(e) {
      if (isAxiosError(e)) {
        return rejectWithValue(e.response?.data?.message || 'Неизвестная ошибка');
      }
      throw e;

    }
  }
)

export const updateOrderStatus = createAsyncThunk<
  IOrder,
  { orderId: string; updatedStatus: string },
  { state: RootState }
>(
  'orders/updateOrderStatus',
  async({ orderId, updatedStatus }) => {
    const response = await axiosApi.patch<IOrder>(`orders/${orderId}`, {status: updatedStatus});
    return response.data;
  }
)

export const deleteOrder = createAsyncThunk<void, string, {state: RootState}>(
  'orders/deleteOrder',
  async(orderId) => {
    await axiosApi.delete(`orders/${orderId}`);
  }
)