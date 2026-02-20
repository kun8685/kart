import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],
    shippingAddress: localStorage.getItem('shippingAddress')
        ? JSON.parse(localStorage.getItem('shippingAddress'))
        : {},
    paymentMethod: 'Razorpay',
    appliedCoupon: localStorage.getItem('appliedCoupon')
        ? JSON.parse(localStorage.getItem('appliedCoupon'))
        : null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x.product === item.product);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x.product === existItem.product ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.appliedCoupon = null;
            localStorage.removeItem('cartItems');
            localStorage.removeItem('appliedCoupon');
        },
        applyCouponState: (state, action) => {
            state.appliedCoupon = action.payload;
            localStorage.setItem('appliedCoupon', JSON.stringify(action.payload));
        },
        removeCouponState: (state) => {
            state.appliedCoupon = null;
            localStorage.removeItem('appliedCoupon');
        }
    },
});

export const {
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCart,
    applyCouponState,
    removeCouponState,
} = cartSlice.actions;

export default cartSlice.reducer;
