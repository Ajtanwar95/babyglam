import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import dashboardReducer from './slices/dashboardSlice';
import cartReducer from './slices/cartSlice';
import reviewReducer from './slices/reviewSlice';
export const store = configureStore({
  reducer: {
    products: productsReducer,
    dashboard: dashboardReducer,
      cart: cartReducer,
          reviews: reviewReducer,
  },
});

export default store;
