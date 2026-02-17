import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import { CreditCard, Wallet, Truck, ShieldCheck, Zap, ArrowRight, Banknote } from 'lucide-react';


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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full mx-auto space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                        Select Payment
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Choose how you would like to pay
                    </p>
                </div>

                <form onSubmit={submitHandler} className="mt-8 space-y-5">
                    <div className="space-y-4">
                        {/* Pay Online Option - Highlighted */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all duration-200 overflow-hidden ${paymentMethod === 'Razorpay'
                                ? 'border-primary bg-blue-50/50 shadow-md ring-1 ring-primary/20'
                                : 'border-gray-200 bg-white hover:border-blue-200'
                                }`}
                            onClick={() => setPaymentMethod('Razorpay')}
                        >
                            {/* Recommended Badge */}
                            <div className="absolute top-0 right-0 bg-gradient-to-bl from-primary to-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                                <Zap size={10} fill="currentColor" /> MOST POPULAR
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'Razorpay' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                                        {paymentMethod === 'Razorpay' && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <input
                                        id="razorpay"
                                        name="paymentMethod"
                                        type="radio"
                                        className="hidden"
                                        value="Razorpay"
                                        checked={paymentMethod === 'Razorpay'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                </div>

                                <div className="flex-1">
                                    <label htmlFor="razorpay" className="font-bold text-gray-900 text-lg cursor-pointer">
                                        Pay Online
                                    </label>
                                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                                        Get extra rewards & faster refunds. <br />
                                        <span className="text-green-600 font-medium flex items-center gap-1 mt-1">
                                            <ShieldCheck size={12} /> 100% Safe Payments
                                        </span>
                                    </p>

                                    {/* Payment Icons */}
                                    <div className="flex gap-2 mt-3 opacity-70 grayscale hover:grayscale-0 transition-all">
                                        {/* Mock icons using text/divs if real SVGs aren't available, but lucide is good enough for generic representation */}
                                        <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-600">UPI</div>
                                        <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-600">VISA</div>
                                        <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-600">RUPAY</div>
                                    </div>
                                </div>
                                <div className={`p-2 rounded-full ${paymentMethod === 'Razorpay' ? 'bg-blue-100 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                                    <CreditCard size={20} />
                                </div>
                            </div>
                        </motion.div>

                        {/* COD Option - Standard */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all duration-200 ${paymentMethod === 'COD'
                                ? 'border-gray-400 bg-gray-50 shadow-sm'
                                : 'border-gray-100 bg-white hover:bg-gray-50'
                                }`}
                            onClick={() => setPaymentMethod('COD')}
                        >
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'COD' ? 'border-gray-600 bg-gray-600' : 'border-gray-300'}`}>
                                        {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <input
                                        id="cod"
                                        name="paymentMethod"
                                        type="radio"
                                        className="hidden"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                </div>

                                <div className="flex-1">
                                    <label htmlFor="cod" className="font-semibold text-gray-700 text-base cursor-pointer">
                                        Cash on Delivery
                                    </label>
                                    <p className="text-gray-400 text-xs mt-1">
                                        Pay with cash upon delivery
                                    </p>
                                </div>
                                <div className={`p-2 rounded-full ${paymentMethod === 'COD' ? 'bg-gray-200 text-gray-600' : 'bg-gray-50 text-gray-300'}`}>
                                    <Banknote size={20} />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-blue-500/30 transition-all"
                    >
                        CONTINUE SECURELY <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest mt-4">
                        <ShieldCheck size={12} /> Secure 256-bit SSL Encrypted
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentScreen;
