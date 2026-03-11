import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";


const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_CHARGE = 200;
const TAX_RATE = 0.18;


const recalculate = (state: CartReducerInitialState): void => {
  state.subtotal = state.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  state.shippingCharges =
    state.subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  state.tax = state.subtotal * TAX_RATE;
  state.total = Math.max(
    0,
    Math.round(
      state.subtotal + state.tax + state.shippingCharges - state.discount
    )
  );
};


const initialState: CartReducerInitialState = {
  loading: false,
  cartItems: [],
  subtotal: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  coupon: undefined,
  shippingInfo: {
    fullName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
};

export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
   
    addToCart: (state, action: PayloadAction<CartItem>) => {
      if (action.payload.quantity <= 0) return;

      const safeQuantity = Math.min(
        action.payload.quantity,
        action.payload.stock ?? Infinity
      );
      const item: CartItem = { ...action.payload, quantity: safeQuantity };

      const index = state.cartItems.findIndex(
        (i) => i.productId === item.productId
      );

      if (index !== -1) state.cartItems[index] = item;
      else state.cartItems.push(item);

      recalculate(state);
    },

    removeCartItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (i) => i.productId !== action.payload
      );
      recalculate(state);
    },

   
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((i) => i.productId === action.payload);
      if (!item) return;

      const maxQty = item.stock ?? Infinity;
      if (item.quantity < maxQty) {
        item.quantity += 1;
        recalculate(state);
      }
    },

    decrementQuantity: (state, action: PayloadAction<string>) => {
      const index = state.cartItems.findIndex(
        (i) => i.productId === action.payload
      );
      if (index === -1) return;

      if (state.cartItems[index].quantity > 1) {
        state.cartItems[index].quantity -= 1;
      } else {
        state.cartItems.splice(index, 1);
      }
      recalculate(state);
    },


    discountApplied: (state, action: PayloadAction<number>) => {
      state.discount = Math.min(
        Math.max(0, action.payload),
        state.subtotal
      );
      recalculate(state);
    },


    saveCoupon: (state, action: PayloadAction<string | undefined>) => {
      state.coupon = action.payload;
      if (!action.payload) {
        state.discount = 0;
        recalculate(state);
      }
    },

    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },

    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    resetCart: () => initialState,
  },
});

export const {
  addToCart,
  removeCartItem,
  incrementQuantity,
  decrementQuantity,
  discountApplied,
  saveShippingInfo,
  saveCoupon,
  setCartLoading,
  resetCart,
} = cartReducer.actions;