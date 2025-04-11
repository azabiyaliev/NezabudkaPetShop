import { createAsyncThunk } from '@reduxjs/toolkit';
import { IOrder, OrderMutation } from '../../types';
import axiosApi from '../../axiosApi.ts';
import { RootState } from '../../app/store.ts';

export const getAllOrders = createAsyncThunk<IOrder[], void, {state: RootState}>(
  'orders/getAllOrders',
  async(_, {getState}) => {
    const token = getState().users.user?.token;
    const response = await axiosApi.get('orders/all-orders', {
      headers: {
        Authorization: token
      },
    });
    return response.data || []
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
      }
    } catch(e) {
      console.log('Ошибка оформления заказа:', e);
    }
  }
)

// export const checkoutGuestOrder = createAsyncThunk<void, OrderMutation>(
//   'orders/checkoutGuestOrder',
//   async(order, { rejectWithValue }) => {
//     console.log('Отправка заказа:', order);
//     try {
//       await axiosApi.post('orders/guest-checkout', order);
//     } catch (e) {
//       console.error('Ошибка оформления заказа:', e);
//       return rejectWithValue(e);
//     }
//   }
// )

export const updateOrderStatus = createAsyncThunk<
  IOrder,
  { orderId: number; updatedStatus: OrderMutation },
  { state: RootState }
>(
  'orders/updateOrderStatus',
  async({ orderId, updatedStatus }, {getState}) => {
    const token = getState().users.user?.token;
    const response = await axiosApi.patch<IOrder>(`orders/${orderId}`, updatedStatus, {
      headers: {
        Authorization: token
      },
    });
    return response.data;
  }
)

export const deleteOrder = createAsyncThunk<IOrder, number, {state: RootState}>(
  'orders/deleteOrder',
  async(orderId, {getState}) => {
    const token = getState().users.user?.token;
    return await axiosApi.delete(`orders/${orderId}`, {
      headers: {
        Authorization: token
      }
    })
  }
)