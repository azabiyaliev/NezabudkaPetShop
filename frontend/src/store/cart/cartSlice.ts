import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICart, ProductResponse } from '../../types';
import { RootState } from '../../app/store.ts';

interface CartSliceInterface {
  carts: ICart[];
}

const initialState:CartSliceInterface = {
  carts: [],
}

export const cartsFromSlice = (state: RootState) => state.carts.carts;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    productCardToAdd: (state, {payload: product}: PayloadAction<ProductResponse>) => {
      const indexProduct = state.carts.findIndex((order) => order.product.id === product.id);
      if (indexProduct === -1) {
        state.carts = [...state.carts, {product, quantity: 1}];
      } else {
        const initialCards = [...state.carts];
        const initialCard = {...initialCards[indexProduct]};
        initialCard.quantity++;
        initialCards[indexProduct] = initialCard;
        state.carts = [...initialCards];
      }
    },
    productCardToRemoveQuantity: (state, {payload: product}: PayloadAction<ProductResponse>) => {
      const indexProduct = state.carts.findIndex((order) => order.product.id === product.id);
      if (indexProduct === -1) {
        state.carts = [...state.carts, {product, quantity: 1}];
      } else {
        const initialCards = [...state.carts];
        const initialCard = {...initialCards[indexProduct]};
        if (initialCard.quantity > 0) {
          initialCard.quantity--;
        } else {
          initialCard.quantity = 0;
        }
        initialCards[indexProduct] = initialCard;
        state.carts = [...initialCards];
      }
      const checkOrder: number[] = state.carts.map((order) => {
        return order.quantity;
      });

      const sum: number = checkOrder.reduce((acc: number, i: number) => {
        acc = acc + i;
        return acc;
      }, 0);

      if (sum === 0) {
        state.carts = [];
        localStorage.removeItem('cart');
      }
    },
    getFromLocalStorage: (state) => {
      const productOrders = localStorage.getItem('cart');
      if (productOrders) {
        state.carts = JSON.parse(productOrders);
      }
    },
    setToLocalStorage: (_state, {payload: cart}) => {
      localStorage.setItem('cart', JSON.stringify(cart));
    },
    deleteProduct: (state, { payload: productId }) => {
      const indexProduct = state.carts.findIndex((order) => order.product.id === productId);
      if (indexProduct !== -1) {
        state.carts.splice(indexProduct, 1);
      }
      localStorage.setItem('cart', JSON.stringify(state.carts));
    },
    clearCart: (state) => {
      state.carts = [];
      localStorage.removeItem('cart');
    }
  },
});

export const cartReducer = cartSlice.reducer;
export const { productCardToAdd, productCardToRemoveQuantity, getFromLocalStorage, deleteProduct, setToLocalStorage, clearCart } = cartSlice.actions;
