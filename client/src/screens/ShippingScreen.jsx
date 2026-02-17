import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress, savePaymentMethod } from '../slices/cartSlice';
import { MapPin, Building, Globe, Home, ChevronRight, Truck, Info, Package } from 'lucide-react';


const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress, cartItems } = cart;

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country] = useState(shippingAddress.country || 'India');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        // Default to COD initially if not set, but PlaceOrderScreen will handle selection
        if (!cart.paymentMethod) {
            dispatch(savePaymentMethod('COD'));
        }
        navigate('/placeorder');
    };

    // Calculate subtotal for summary
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

    return (
        <div className="min-h-screen bg-gray-50 py-8 font-sans">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Checkout Steps (Visual) - Removed 'Payment' Step */}
                <div className="flex items-center justify-center mb-10 text-sm font-medium text-gray-500">
                    <span className="text-gray-400">Cart</span>
                    <ChevronRight size={16} className="mx-2" />
                    <span className="text-primary font-bold">Address</span>
                    <ChevronRight size={16} className="mx-2" />
                    <span className="text-gray-400">Review & Pay</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left Side: Shipping Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 w-full"
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <div className="mb-6 border-b pb-4">
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Truck size={24} className="text-primary" /> Delivery Details
                                </h1>
                                <p className="text-gray-500 text-sm mt-1 ml-8">
                                    Where should we deliver your order?
                                </p>
                            </div>

                            <form onSubmit={submitHandler} className="space-y-6">
                                <div className="space-y-5">
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                            Street Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Home size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                id="address"
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition sm:text-sm"
                                                placeholder="House No, Building, Street Area"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Building size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    id="city"
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition sm:text-sm"
                                                    placeholder="City / District"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MapPin size={18} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    id="postalCode"
                                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition sm:text-sm"
                                                    placeholder="6-digit Pincode"
                                                    value={postalCode}
                                                    onChange={(e) => setPostalCode(e.target.value)}
                                                    maxLength={6}
                                                    pattern="[0-9]*"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Globe size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                id="country"
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 bg-gray-50 text-gray-500 rounded-lg shadow-sm focus:outline-none cursor-not-allowed transition sm:text-sm"
                                                value={country}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-blue-500/30 transition-all uppercase tracking-wide mt-8"
                                >
                                    DELIVER HERE <ChevronRight size={20} />
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Right Side: Mini Summary */}
                    <div className="hidden lg:block w-80">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                                <Package size={18} /> Order Summary
                            </h3>
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Items ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)})</span>
                                    <span className="font-medium">₹{itemsPrice}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery</span>
                                    <span className="font-medium text-green-600">Calculated next</span>
                                </div>
                            </div>

                            {/* Mini items preview (first 3) */}
                            <div className="space-y-3 mt-6">
                                {cartItems.slice(0, 3).map((item, index) => (
                                    <div key={index} className="flex gap-3 items-center">
                                        <div className="w-10 h-10 bg-gray-50 rounded p-1 border border-gray-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs font-medium text-gray-800 truncate">{item.name}</p>
                                            <p className="text-[10px] text-gray-500">Qty: {item.qty}</p>
                                        </div>
                                    </div>
                                ))}
                                {cartItems.length > 3 && (
                                    <p className="text-xs text-gray-400 text-center pt-2">+ {cartItems.length - 3} more items</p>
                                )}
                            </div>

                            <div className="mt-6 bg-blue-50 p-3 rounded-lg flex gap-2 items-start">
                                <Info size={16} className="text-blue-600 mt-0.5" />
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    Complete address ensures faster delivery. Please verify your Pincode carefully.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ShippingScreen;
