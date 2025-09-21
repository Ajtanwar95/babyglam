import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart');
    return savedCart
      ? JSON.parse(savedCart)
      : { items: [], isOpen: false, showOfferPopup: false, offerExpiry: null, wishlist: [] };
  }
  return { items: [], isOpen: false, showOfferPopup: false, offerExpiry: null, wishlist: [] };
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      state.showOfferPopup = false;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);
      if (item && quantity > 0 && quantity <= item.stock) {
        item.quantity = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
      if (!state.isOpen && (state.items.length === 0 || state.items.reduce((sum, item) => sum + item.price * item.quantity, 0) < 30)) {
        state.showOfferPopup = true;
        state.offerExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
      } else {
        state.showOfferPopup = false;
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      state.isOpen = false;
      state.showOfferPopup = false;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    dismissOfferPopup: (state) => {
      state.showOfferPopup = false;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    addToWishlist: (state, action) => {
      const product = action.payload;
      if (!state.wishlist.some((item) => item._id === product._id)) {
        state.wishlist.push(product);
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter((item) => item._id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  toggleCart,
  clearCart,
  dismissOfferPopup,
  addToWishlist,
  removeFromWishlist,
} = cartSlice.actions;
export default cartSlice.reducer;