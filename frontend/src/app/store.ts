import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../store/users/usersSlice.ts";
import { editSiteReducer } from "../store/editionSite/editionSiteSlice.ts";
import { categoriesReducer } from "../store/categories/categoriesSlice.ts";
import { brandReducer } from "../store/brands/brandsSlice.ts";
import { productsReducer } from "../store/products/productsSlice.ts";
import { cartReducer } from "../store/cart/cartSlice.ts";
import { photoCarouselReducer } from '../store/photoCarousel/photoCarouselSlice.ts';
import { adminReducer } from '../store/admins/adminSlice.ts';
import { orderReducer } from '../store/orders/ordersSlice.ts';
import { favoriteProductsReducer } from '../store/favoriteProducts/favoriteProductsSlice.ts';
import { historyReducer } from '../store/historyProduct/historyProductSlice.ts';
import { companyPageReducer } from '../store/companyPage/compantPageSlice.ts';
import { bonusPageReducer } from '../store/bonusProgramPage/bonusProgramPageSlice.ts';
import { deliveryPageReducer } from '../store/deliveryPage/deliveryPageSlice.ts';
import { adminInfoReducer } from '../store/adminInfo/adminInfoSlice.ts';
import { clientInfoReducer } from '../store/clientInfo/clientInfoSlice.ts';



const rootReducer = combineReducers({
  users:  userReducer,
  brands: brandReducer,
  edit_site: editSiteReducer,
  categories: categoriesReducer,
  products: productsReducer,
  photo_carousel: photoCarouselReducer,
  admins: adminReducer,
  orders: orderReducer,
  cart: cartReducer,
  favorites: favoriteProductsReducer,
  history: historyReducer,
  company_page: companyPageReducer,
  bonus_program: bonusPageReducer,
  delivery: deliveryPageReducer,
  admin_info: adminInfoReducer,
  client_info: clientInfoReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
