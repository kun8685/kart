import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (!shippingAddress.address) {
        navigate('/shipping');
    }

    const [paymentMethod, setPaymentMethod] = useState('Razorpay');

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 text-center uppercase tracking-wide">Payment Method</h2>
                </div>

                <form onSubmit={submitHandler} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50 transition">
                            <input
                                id="razorpay"
                                name="paymentMethod"
                                type="radio"
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                                value="Razorpay"
                                checked={paymentMethod === 'Razorpay'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label htmlFor="razorpay" className="ml-3 block text-sm font-medium text-gray-700 w-full cursor-pointer">
                                Razorpay / UPI / NetBanking
                            </label>
                        </div>

                        <div className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50 transition">
                            <input
                                id="cod"
                                name="paymentMethod"
                                type="radio"
                                className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                                value="COD"
                                checked={paymentMethod === 'COD'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700 w-full cursor-pointer">
                                Cash on Delivery
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary uppercase shadow"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentScreen;
