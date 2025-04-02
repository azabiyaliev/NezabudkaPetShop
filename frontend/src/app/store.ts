import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import {
  FLUSH,
  PAUSE,
  PURGE,
  REGISTER,
  REHYDRATE,
  PERSIST,
} from "redux-persist";
import { userReducer } from "../store/users/usersSlice.ts";
import { editSiteReducer } from "../store/editionSite/editionSiteSlice.ts";
import { categoriesReducer } from "../store/categories/categoriesSlice.ts";
import { brandReducer } from "../store/brands/brandsSlice.ts";
import { productsReducer } from "../store/products/productsSlice.ts";
import { cartReducer } from "../store/cart/cartSlice.ts";
import { photoCarouselReducer } from '../store/photoCarousel/photoCarouselSlice.ts';
import { adminReducer } from '../store/admins/adminSlice.ts';

const userPersistConfig = {
  key: "store:users",
  storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  users: persistReducer(userPersistConfig, userReducer),
  brands: brandReducer,
  edit_site: editSiteReducer,
  categories: categoriesReducer,
  products: productsReducer,
  carts: cartReducer,
  photo_carousel: photoCarouselReducer,
  admins: adminReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
