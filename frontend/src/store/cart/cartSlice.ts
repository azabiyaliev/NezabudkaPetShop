import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addItem, createCart, deleteItemCart, deleteItemsCart, fetchCart, updateCartItem } from './cartThunk.ts';
import { GlobalError, ICartBack, ProductResponse } from '../../types';
import { RootState } from '../../app/store.ts';

interface CartState {
  cart: ICartBack | null;
  loadings: {
    getLoading: boolean;
    createLoading: boolean;
    deleteLoading: boolean;
    addProductLoading: boolean;
    editProductLoading: boolean;
    deleteProductLoading: boolean;
  },
  errors: {
    getCartError: GlobalError | null;
    createError: GlobalError | null;
    deleteError: GlobalError | null;
    addProductError: GlobalError | null;
    deleteProductError: GlobalError | null;
    editProductError: GlobalError | null;
  },
}

const initialState: CartState = {
  cart: null,
  loadings: {
    getLoading: false,
    createLoading: false,
    deleteLoading: false,
    addProductLoading: false,
    editProductLoading: false,
    deleteProductLoading: false,
  },
  errors: {
    getCartError: null,
    createError: null,
    deleteError: null,
    addProductError: null,
    deleteProductError: null,
    editProductError: null,
  },
}

export const cartFromSlice = (state: RootState)=> state.cart.cart;
export const cartErrorFromSlice = (state: RootState)=> state.cart.errors.getCartError;
export const cartCreateErrorFromSlice = (state: RootState)=> state.cart.errors.createError;
export const addProductErrorFromSlice = (state: RootState)=> state.cart.errors.addProductError;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    productCardToAdd: (state, { payload: product }: PayloadAction<ProductResponse>) => {
      if (state.cart) {
        const indexProduct = state.cart.products.findIndex(
          (item) => item.product.id === product.id
        );
        if (indexProduct !== -1) {
          state.cart.products[indexProduct].quantity += 1;
        } else {
          const newItem = {
            id: Date.now(),
            cartId: state.cart.id,
            productId: product.id,
            quantity: 1,
            product,
          };
          state.cart.products.push(newItem);
        }
      }
    },
    productCardToRemoveQuantity: (state, { payload: product }: PayloadAction<ProductResponse>) => {
      if (state.cart) {
        const indexProduct = state.cart.products.findIndex((order) => order.product.id === product.id);if (indexProduct === -1) {
          return;
        }
        const currentItem = state.cart.products[indexProduct];if (currentItem.quantity > 1) {
          currentItem.quantity--;
        } else {
          state.cart.products.splice(indexProduct, 1);
        }
      }
    },
    getFromLocalStorage: (state) => {
      const productOrders = localStorage.getItem("cart");
      if (productOrders) {
        state.cart = JSON.parse(productOrders);
      }
    },
    setToLocalStorage: (_state, { payload: cart }) => {
      localStorage.setItem("cart", JSON.stringify(cart));
    },
    deleteProductInCart: (state, { payload: productId }) => {
      if (state.cart) {
        const indexProduct = state.cart.products.findIndex(
          (item) => item.product.id === productId);
        if (indexProduct !== -1) {
          state.cart.products.splice(indexProduct, 1);
        }
      }
    },
    clearCart: (state) => {
      if (state.cart) {
        state.cart.products = [];
      }
    },
    newUserLogin: (state) => {
      const cartFromLS = localStorage.getItem("cart");
      if (cartFromLS === null && state.cart === null) {
        state.cart = {
          id: Date.now(),
          userId: Date.now(),
          products: [],
        }
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loadings.getLoading = true;
        state.errors.getCartError = null;
      })
      .addCase(fetchCart.fulfilled, (state, {payload: cart}) => {
        state.loadings.getLoading = false;
        state.errors.getCartError = null;
        state.cart = cart;
      })
      .addCase(fetchCart.rejected, (state, {payload: error}) => {
        state.loadings.getLoading = false;
        state.errors.getCartError = error || null;
      })
      .addCase(createCart.pending, (state) => {
        state.loadings.createLoading = true;
        state.errors.createError = null;
      })
      .addCase(createCart.fulfilled, (state) => {
        state.loadings.createLoading = false;
        state.errors.createError = null;
      })
      .addCase(createCart.rejected, (state, {payload: error}) => {
        state.loadings.createLoading = false;
        state.errors.createError = error || null;
      })
      .addCase(addItem.pending, (state) => {
        state.loadings.addProductLoading = true;
        state.errors.addProductError = null;
      })
      .addCase(addItem.fulfilled, (state) => {
        state.loadings.addProductLoading = false;
        state.errors.addProductError = null;
      })
      .addCase(addItem.rejected, (state, {payload: error}) => {
        state.loadings.addProductLoading = false;
        state.errors.addProductError = error || null;
      })
      .addCase(deleteItemCart.pending, (state) => {
        state.loadings.deleteProductLoading = true;
        state.errors.deleteProductError = null;
      })
      .addCase(deleteItemCart.fulfilled, (state) => {
        state.loadings.deleteProductLoading = false;
        state.errors.deleteProductError = null;
      })
      .addCase(deleteItemCart.rejected, (state, {payload: error}) => {
        state.loadings.deleteProductLoading = false;
        state.errors.deleteProductError = error || null;
      })
      .addCase(deleteItemsCart.pending, (state) => {
        state.loadings.deleteLoading = true;
        state.errors.deleteError = null;
      })
      .addCase(deleteItemsCart.fulfilled, (state) => {
        state.loadings.deleteLoading = false;
        state.errors.deleteError = null;
      })
      .addCase(deleteItemsCart.rejected, (state, {payload: error}) => {
        state.loadings.deleteLoading = false;
        state.errors.deleteError = error || null;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loadings.editProductLoading = true;
        state.errors.editProductError = null;
      })
      .addCase(updateCartItem.fulfilled, (state) => {
        state.loadings.editProductLoading = false;
        state.errors.editProductError = null;
      })
      .addCase(updateCartItem.rejected, (state, {payload: error}) => {
        state.loadings.editProductLoading = false;
        state.errors.editProductError = error || null;
      });
  }
});

export const cartReducer = cartSlice.reducer;
export const { productCardToAdd, productCardToRemoveQuantity, getFromLocalStorage, setToLocalStorage, deleteProductInCart, clearCart, newUserLogin } = cartSlice.actions;