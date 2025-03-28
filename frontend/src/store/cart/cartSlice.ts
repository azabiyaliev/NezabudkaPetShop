import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICart, ProductResponse } from '../../types';
import { RootState } from '../../app/store.ts';

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
      }
    },
    getFromLocalStorage: (state) => {
      const productOrders = localStorage.getItem('cart');
      if (productOrders) {
        state.carts = JSON.parse(productOrders);
      }
    },
    deleteProduct: (state, { payload: productId }) => {
      const indexProduct = state.carts.findIndex((order) => order.product.id === productId);
      if (indexProduct !== -1) {
        state.carts.splice(indexProduct, 1);
      }
      localStorage.setItem('cart', JSON.stringify(state.carts));
    }

  // extraReducers: (builder) => {
  //   builder
      // .addCase(addCart.pending, (state) => {
      //   state.loadings.addLoading = true;
      //   state.error = false;
      // })
      // .addCase(addCart.fulfilled, (state) => {
      //   state.loadings.addLoading = false;
      //   state.error = false;
      // })
      // .addCase(addCart.rejected, (state) => {
      //   state.loadings.addLoading = false;
      //   state.error = true;
      // })
      // .addCase(getCart.pending, (state) => {
      //   state.loadings.getLoading = true;
      //   state.error = false;
      // })
      // .addCase(getCart.fulfilled, (state, {payload: carts}) => {
      //   state.loadings.getLoading = false;
      //   state.error = false;
      //   state.carts = carts;
      // })
      // .addCase(getCart.rejected, (state) => {
      //   state.loadings.getLoading = false;
      //   state.error = true;
      // })
      // .addCase(editCart.pending, (state) => {
      //   state.loadings.updateLoading = true;
      //   state.error = false;
      // })
      // .addCase(editCart.fulfilled, (state) => {
      //   state.loadings.updateLoading = false;
      //   state.error = false;
      // })
      // .addCase(editCart.rejected, (state) => {
      //   state.loadings.updateLoading = false;
      //   state.error = true;
      // })
      // .addCase(cartDelete.pending, (state) => {
      //   state.loadings.deleteLoading = true;
      //   state.error = false;
      // })
      // .addCase(cartDelete.fulfilled, (state) => {
      //   state.loadings.deleteLoading = false;
      //   state.error = false;
      // })
      // .addCase(cartDelete.rejected, (state) => {
      //   state.loadings.deleteLoading = false;
      //   state.error = true;
      // })
      // .addCase(emptyingTrash.pending, (state) => {
      //   state.loadings.deleteLoading = true;
      //   state.error = false;
      // })
      // .addCase(emptyingTrash.fulfilled, (state, {payload: carts}) => {
      //   state.loadings.deleteLoading = false;
      //   state.error = false;
      //   state.carts = carts || [];
      // })
      // .addCase(emptyingTrash.rejected, (state) => {
      //   state.loadings.deleteLoading = false;
      //   state.error = true;
      // });
  },
});

export const cartReducer = cartSlice.reducer;
export const { productCardToAdd, productCardToRemoveQuantity, getFromLocalStorage, deleteProduct } = cartSlice.actions;
