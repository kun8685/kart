import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, savePaymentMethod } from '../slices/cartSlice';
import axios from 'axios';
import { MapPin, CreditCard, ShoppingBag, ShieldCheck, Clock, CheckCircle, Flame, BatteryWarning, Zap } from 'lucide-react';
import { motion } from 'framer-motion';


const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    // FOMO Timer State
    const [timeLeft, setTimeLeft] = useState(600);
    const [viewers, setViewers] = useState(() => Math.floor(Math.random() * (148 - 112 + 1)) + 112);

    useEffect(() => {
        const intervalId = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 600), 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setViewers(prev => {
                const change = Math.floor(Math.random() * 9) - 3;
                const newState = prev + change;
                if (newState < 105) return 105 + Math.floor(Math.random() * 5);
                if (newState > 180) return 180 - Math.floor(Math.random() * 5);
                return newState;
            });
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // Calculate Prices
    const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
    const itemsPriceNumber = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const totalOriginalPriceNumber = cart.cartItems.reduce((acc, item) => acc + Number(item.qty) * ((item.originalPrice && item.originalPrice > item.price) ? item.originalPrice : Math.round(item.price * 1.1)), 0);

    // itemsPrice display is the MRP total
    const itemsPrice = addDecimals(totalOriginalPriceNumber);

    const initialPaymentMethod = (cart.paymentMethod === 'Razorpay' ? 'Online' : cart.paymentMethod) || 'Online';
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(initialPaymentMethod);

    useEffect(() => {
        dispatch(savePaymentMethod(selectedPaymentMethod));
    }, [selectedPaymentMethod, dispatch]);

    // Shipping Logic
    const isCodDisabled = itemsPriceNumber >= 1200;

    // Force Online if COD is disabled but somehow selected
    useEffect(() => {
        if (isCodDisabled && selectedPaymentMethod === 'COD') {
            setSelectedPaymentMethod('Online');
        }
    }, [isCodDisabled, selectedPaymentMethod]);

    let shippingCost = 0;
    const isOnlinePayment = selectedPaymentMethod === 'Online' || selectedPaymentMethod === 'Razorpay';

    // Always free for online to encourage it. Always charge for COD for safety.
    if (isOnlinePayment) {
        shippingCost = 0;
    } else {
        shippingCost = 69; // Advance delivery charge
    }

    const shippingPrice = addDecimals(shippingCost);

    // Extra Discount based on true MRP vs Selling Price
    const discountNumber = totalOriginalPriceNumber - itemsPriceNumber;
    let discountPrice = discountNumber;

    // Apply Coupon
    const couponDiscount = cart.appliedCoupon ? cart.appliedCoupon.discountAmount : 0;
    discountPrice += couponDiscount;

    const taxPrice = "0.00"; // Removed 18% extra tax visually
    const totalPrice = (Number(itemsPrice) - Number(discountPrice) + Number(shippingPrice)).toFixed(2);

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        }
    }, [cart.shippingAddress.address, navigate]);

    // --- PAYMENT INTEGRATION ---
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePaymentAndOrder = async () => {
        try {
            // 1. Create Order (Pending State)
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const orderData = {
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: selectedPaymentMethod,
                itemsPrice: itemsPrice,
                shippingPrice: shippingPrice,
                taxPrice: taxPrice,
                totalPrice: totalPrice,
                couponCode: cart.appliedCoupon ? cart.appliedCoupon.code : null,
                couponDiscount: couponDiscount,
            };

            const { data: createdOrder } = await axios.post('/api/orders', orderData, config);
            const orderId = createdOrder._id;

            // Calculate Amount to Pay for Razorpay
            const amountToPay = isOnlinePayment ? totalPrice : shippingPrice;

            // If COD and no shipping fee, bypass Razorpay completely
            if (!isOnlinePayment && Number(amountToPay) === 0) {
                dispatch(clearCart());
                navigate(`/order/${orderId}`);
                return;
            }

            // 2. Initiate Payment IMMEDIATEY (Don't navigate away)
            const res = await loadRazorpay();
            if (!res) {
                alert('Payment SDK failed to load. Are you online?');
                return;
            }

            // Get Key
            const { data: { key } } = await axios.get('/api/payment/razorpay/key', config);

            // Create Razorpay Order
            const { data: razorpayOrder } = await axios.post('/api/payment/razorpay', {
                amount: amountToPay,
                receipt: orderId,
            }, config);

            const options = {
                key: key,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'GauryKart',
                description: isOnlinePayment ? `Order #${orderId}` : `Delivery Fee for #${orderId}`,
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    try {
                        // Verify Payment
                        await axios.post('/api/payment/razorpay/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: orderId,
                        }, config);

                        // Success! NOW we clear cart and navigate
                        dispatch(clearCart());
                        navigate(`/order/${orderId}`);
                    } catch (error) {
                        console.error(error);
                        alert('Payment Verification Failed. Please contact support.');
                    }
                },
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                },
                theme: {
                    color: '#2874f0',
                },
                modal: {
                    ondismiss: function () {
                        // User closed the popup without paying. 
                        // We DO NOT navigate to success page. We stay here.
                        // Order exists in backend as "Pending", which is fine (abandoned cart).
                        console.log('Payment modal closed');
                    }
                }
            };

            if (!window.Razorpay) {
                alert('Razorpay SDK failed to load. Please check your internet connection.');
                return;
            }

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Something went wrong creating the order.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 font-sans">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Visual Progress */}
                <div className="flex items-center justify-center mb-6 text-xs sm:text-sm font-medium text-gray-400">
                    <span>Address</span>
                    <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                    <span className="text-primary font-bold">Review & Pay</span>
                    <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                    <span>Complete</span>
                </div>

                {/* FOMO & Urgency Banners */}
                <div className="space-y-3 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-600 text-white rounded-lg p-3 flex items-center justify-between shadow-md"
                    >
                        <div className="flex items-center gap-2">
                            <Clock size={20} className="animate-pulse" />
                            <span className="font-bold text-sm sm:text-base">
                                Offers expire in {formatTime(timeLeft)}
                            </span>
                        </div>
                        <span className="bg-white text-red-600 px-2 py-0.5 rounded text-xs font-bold uppercase">Reserve Yours</span>
                    </motion.div>

                    <div className="flex gap-3 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border border-orange-200">
                            <Flame size={14} className="fill-orange-500 text-orange-500" /> {viewers} people viewing this
                        </div>
                        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border border-yellow-200">
                            <BatteryWarning size={14} /> Low Stock - Selling Fast!
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column */}
                    <div className="lg:w-2/3 space-y-5">
                        {/* Address */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-2 rounded-full text-gray-500">
                                    <MapPin size={18} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-gray-800">Delivering to:</p>
                                    <p className="text-gray-600 truncate max-w-[200px] sm:max-w-xs">{cart.shippingAddress.address}, {cart.shippingAddress.city}...</p>
                                </div>
                            </div>
                            <button onClick={() => navigate('/shipping')} className="text-primary text-sm font-bold hover:underline">Change</button>
                        </div>

                        {/* Payment Selection */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                                <CreditCard size={20} className="text-primary" /> Select Payment Mode
                            </h2>

                            <div className="space-y-3">
                                <div
                                    onClick={() => setSelectedPaymentMethod('Online')}
                                    className={`relative border rounded-xl p-4 cursor-pointer transition-all ${isOnlinePayment ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className="absolute -top-2 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                        FREE DELIVERY
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isOnlinePayment ? 'border-primary' : 'border-gray-300'}`}>
                                            {isOnlinePayment && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800 flex items-center gap-2">
                                                Pay Online (UPI / Card / NetBanking)
                                                <Zap size={14} className="fill-yellow-400 text-yellow-400" />
                                            </p>
                                            <p className="text-[11px] sm:text-xs text-green-700 font-bold bg-green-100 inline-block px-2 py-0.5 rounded mt-1 shadow-sm border border-green-200">
                                                ✅ Zero Delivery Fee + Secured by Razorpay
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => !isCodDisabled && setSelectedPaymentMethod('COD')}
                                    className={`relative border rounded-xl p-4 transition-all ${isCodDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:border-gray-300'} ${selectedPaymentMethod === 'COD' ? 'border-gray-600 bg-gray-50 ring-1 ring-gray-600' : 'border-gray-200'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === 'COD' ? 'border-gray-600' : 'border-gray-300'}`}>
                                            {selectedPaymentMethod === 'COD' && <div className="w-2.5 h-2.5 bg-gray-600 rounded-full" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-700">Pay on Delivery</p>
                                            <p className={`text-xs font-medium mt-1 ${isCodDisabled ? 'text-red-500' : 'text-gray-500'}`}>
                                                {isCodDisabled
                                                    ? '❌ Not available for orders above ₹1200'
                                                    : '⚠️ To prevent fake orders, pay ₹69 delivery charge now. Pay rest on delivery.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <ShoppingBag size={18} /> Items ({cart.cartItems.length})
                            </h2>
                            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="flex gap-3 items-center border-b border-dashed border-gray-200 pb-3 last:border-0 last:pb-0">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-gray-50 rounded p-1" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                                        </div>
                                        <p className="font-bold text-sm">₹{item.qty * item.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:w-1/3">
                        <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200 sticky top-4">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Bill Details</h2>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Item Total</span>
                                    <span>₹{itemsPrice}</span>
                                </div>
                                <div className="flex justify-between text-green-600 font-medium">
                                    <span>Discount</span>
                                    <span>- ₹{addDecimals(discountPrice)}</span>
                                </div>
                                {cart.appliedCoupon && (
                                    <div className="flex justify-between text-green-600 font-bold bg-green-50 p-1 -mx-2 px-2 rounded">
                                        <span>Coupon ({cart.appliedCoupon.code})</span>
                                        <span>- ₹{addDecimals(couponDiscount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span>Delivery Fee</span>
                                    <span className={Number(shippingPrice) === 0 ? "text-green-600 font-bold" : "text-gray-900"}>
                                        {Number(shippingPrice) === 0 ? "FREE" : `₹${shippingPrice}`}
                                    </span>
                                </div>
                                <div className="flex justify-between opacity-50">
                                    <span>GST / Taxes</span>
                                    <span className="text-green-600">Included</span>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-gray-300 pt-3 mb-4">
                                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                                    <span>{isOnlinePayment ? 'Total Amount' : 'To Pay Now'}</span>
                                    <span>₹{isOnlinePayment ? totalPrice : shippingPrice}</span>
                                </div>
                                <p className="text-[10px] text-right text-gray-400 mt-1">
                                    {isOnlinePayment ? 'Inclusive of all taxes' : `Pay ₹${(totalPrice - shippingPrice).toFixed(2)} in cash on delivery`}
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                className={`w-full text-white text-lg font-extrabold py-4 rounded-xl shadow-xl transition-all uppercase tracking-wider mb-3 ${isOnlinePayment ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/20 animate-pulse-slow' : 'bg-gray-800 shadow-gray-800/20'}`}
                                onClick={handlePaymentAndOrder}
                            >
                                {isOnlinePayment ? "CONFIRM & PAY" : `PAY ₹${shippingPrice} TO CONFIRM`}
                            </motion.button>

                            <div className="bg-gray-50 p-2 rounded text-[10px] text-gray-500 text-center flex justify-center gap-4">
                                <span className="flex items-center gap-1"><ShieldCheck size={12} /> Secure Payment</span>
                                <span className="flex items-center gap-1"><CheckCircle size={12} /> 100% Genuine</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .9; } }`}</style>
        </div>
    );
};

export default PlaceOrderScreen;
