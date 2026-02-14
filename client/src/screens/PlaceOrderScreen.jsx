import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../slices/cartSlice';
import axios from 'axios';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    // Calculate Prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPriceNumber = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const itemsPrice = addDecimals(itemsPriceNumber);

    // Shipping Logic
    const standardShipping = 0; // Removed standard automatic shipping
    const extraShipping = cart.cartItems.reduce((acc, item) => acc + (item.shippingPrice || 0) * item.qty, 0);
    const shippingPrice = addDecimals(standardShipping + extraShipping);
    const taxPrice = addDecimals(Number((0.18 * itemsPrice).toFixed(2)));
    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const placeOrderHandler = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: itemsPrice,
                    shippingPrice: shippingPrice,
                    taxPrice: taxPrice,
                    totalPrice: totalPrice,
                },
                config
            );

            dispatch(clearCart());
            navigate(`/order/${data._id}`);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                    <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 uppercase tracking-wide border-b pb-2">Shipping</h2>
                        <p className="text-gray-600">
                            <strong className="text-gray-900">Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 uppercase tracking-wide border-b pb-2">Payment Method</h2>
                        <p className="text-gray-600">
                            <strong className="text-gray-900">Method: </strong>
                            {cart.paymentMethod}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-800 uppercase tracking-wide border-b pb-2">Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            <div className="space-y-4">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded" />
                                        <div className="flex-1">
                                            <Link to={`/product/${item.product}`} className="font-medium text-gray-800 hover:text-primary">
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="text-gray-600 font-medium">
                                            {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded shadow-sm sticky top-24 border border-gray-100">
                        <h2 className="text-lg font-bold border-b pb-3 mb-4 text-gray-600 uppercase">Order Summary</h2>
                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>₹{itemsPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{shippingPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (GST)</span>
                                <span>₹{taxPrice}</span>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-4 mb-6">
                            <div className="flex justify-between font-bold text-lg text-gray-800">
                                <span>Total</span>
                                <span>₹{totalPrice}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded font-bold shadow transition uppercase tracking-wide"
                            onClick={placeOrderHandler}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;
