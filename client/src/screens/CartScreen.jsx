import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShieldCheck, MapPin } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, applyCouponState, removeCouponState } from '../slices/cartSlice';
import axios from 'axios';
import trackEvent from '../utils/trackEvent';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems, appliedCoupon: savedCoupon } = cart;
    const { userInfo } = useSelector((state) => state.auth);

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(savedCoupon || null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const removeFromCartHandler = (id, name) => {
        trackEvent('remove_from_cart', name);
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        trackEvent('checkout_clicked', `items:${cartItems.length}`);
        if (appliedCoupon) {
            dispatch(applyCouponState(appliedCoupon));
        } else {
            dispatch(removeCouponState());
        }
        navigate('/login?redirect=/shipping');
    };

    const updateQty = (item, newQty) => {
        if (newQty < 1) return;
        if (newQty > item.countInStock) return;
        if (newQty > item.qty) {
            trackEvent('qty_increased', item.name);
        }
        dispatch(addToCart({ ...item, qty: newQty }));
    };

    const totalItems = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);
    const subtotal = cartItems.reduce((acc, item) => acc + Number(item.qty) * item.price, 0);
    const totalOriginalPrice = cartItems.reduce((acc, item) => acc + Number(item.qty) * ((item.originalPrice && item.originalPrice > item.price) ? item.originalPrice : Math.round(item.price * 1.1)), 0);
    const discount = totalOriginalPrice - subtotal;

    // Shipping Logic
    // const standardShipping = subtotal > 500 ? 0 : 40; // Removed standard rule per user request
    const standardShipping = 0;
    const extraShipping = cartItems.reduce((acc, item) => acc + (item.shippingPrice || 0) * item.qty, 0);
    const deliveryCharges = standardShipping + extraShipping;

    const finalAmountBeforeCoupon = subtotal + deliveryCharges;

    // Apply Coupon Logic
    const finalDiscountFromCoupon = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const finalAmount = finalAmountBeforeCoupon - finalDiscountFromCoupon;

    // Total savings
    const totalSavings = discount + finalDiscountFromCoupon;

    // Free Shipping Progress Logic
    const freeShippingThreshold = 499;
    const amountNeededForFreeShipping = freeShippingThreshold - subtotal;
    const progressPercentage = subtotal >= freeShippingThreshold ? 100 : (subtotal / freeShippingThreshold) * 100;

    // Coupon Handler
    const applyCouponHandler = async () => {
        if (!couponCode) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post('/api/coupons/validate', {
                code: couponCode,
                totalAmount: finalAmountBeforeCoupon,
            }, config);

            trackEvent('coupon_applied', couponCode);
            setAppliedCoupon(data);
            setCouponLoading(false);
        } catch (error) {
            setCouponError(error.response?.data?.message || 'Invalid Coupon');
            setAppliedCoupon(null);
            setCouponLoading(false);
        }
    };

    const removeCouponHandler = () => {
        trackEvent('coupon_removed', appliedCoupon?.code || '');
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
        dispatch(removeCouponState());
    };

    // Mock date for delivery
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };

    return (
        <div className="container mx-auto px-4 py-4 md:py-8 bg-[#f1f3f6] min-h-screen">
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left Column: Cart Items */}
                <div className="lg:w-2/3 space-y-4">

                    {/* Address Section (Mock) */}
                    {userInfo && (
                        <div className="bg-white p-4 rounded-sm shadow-sm flex justify-between items-center border border-gray-200">
                            <div className="flex flex-col text-sm">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <span className="text-gray-700">Deliver to:</span>
                                    <span className="font-bold text-gray-900">{userInfo.name}, 110001</span>
                                    <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 rounded">HOME</span>
                                </div>
                                <span className="text-gray-500 text-xs truncate max-w-xs">123, Street Name, City, State...</span>
                            </div>
                            <button className="text-primary font-bold text-sm border p-2 rounded-sm hover:bg-blue-50">Change</button>
                        </div>
                    )}

                    {/* Cart Items */}
                    {cartItems.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-sm shadow-sm border border-gray-200">
                            <img src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="h-40 mx-auto mb-4 opacity-50" />
                            <h2 className="text-xl font-semibold mb-2">Your cart is empty!</h2>
                            <p className="text-sm text-gray-500 mb-6">Explore our wide selection and find something you like</p>
                            <Link to="/" className="bg-[#fb641b] text-white px-10 py-3 rounded-sm font-bold shadow-md hover:bg-[#e85d19] transition">Shop Now</Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {/* Upsell: Free Shipping Progress Bar */}
                            <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200">
                                {subtotal >= freeShippingThreshold ? (
                                    <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                                        <div className="bg-green-100 p-1.5 rounded-full"><ShieldCheck size={18} /></div>
                                        <span>Yay! You get FREE Delivery on this order.</span>
                                    </div>
                                ) : (
                                    <div className="mb-2 text-gray-800 text-sm font-medium">
                                        Add items worth <span className="text-red-500 font-bold">₹{amountNeededForFreeShipping}</span> more to get <span className="text-green-600 font-bold">FREE Delivery</span>
                                    </div>
                                )}
                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div className={`h-2.5 rounded-full transition-all duration-500 ${subtotal >= freeShippingThreshold ? 'bg-green-500' : 'bg-[#fb641b]'}`} style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                                {subtotal < freeShippingThreshold && <div className="text-xs text-gray-500 mt-2">Free delivery on orders above ₹{freeShippingThreshold}</div>}
                            </div>

                            <div className="bg-white rounded-sm shadow-sm border border-gray-200">
                                {cartItems.map((item) => (
                                    <div key={item.product} className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 last:border-0 relative">
                                        {/* Image */}
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 mx-auto sm:mx-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col">
                                            <Link to={`/product/${item.product}`} className="font-medium text-gray-900 hover:text-primary mb-1 line-clamp-2">
                                                {item.name}
                                            </Link>

                                            <div className="text-xs text-gray-500 mb-2 mt-1 flex items-center gap-2">
                                                {item.size || item.color ? (
                                                    <>
                                                        {item.size && <span className="bg-gray-100 px-2 py-0.5 rounded">Size: {item.size}</span>}
                                                        {item.color && <span className="bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block border border-gray-300" style={{ backgroundColor: item.color.toLowerCase() }}></span> Color: {item.color}</span>}
                                                    </>
                                                ) : (
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded">Standard Variant</span>
                                                )}
                                                <span className="mx-0.5">•</span>
                                                Seller: RetailNet
                                            </div>

                                            <div className="flex items-baseline gap-2 mb-4">
                                                <span className="text-gray-500 line-through text-sm">₹{(item.originalPrice && item.originalPrice > item.price) ? item.originalPrice : Math.round(item.price * 1.1)}</span>
                                                <span className="font-bold text-lg text-gray-900">₹{item.price}</span>
                                                <span className="text-green-600 text-sm font-bold">{(item.originalPrice && item.originalPrice > item.price) ? `${Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% Off` : `10% Off`}</span>
                                            </div>

                                            {/* Controls */}
                                            <div className="flex items-center gap-4 md:gap-8 mt-auto">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQty(item, Math.max(1, item.qty - 1))}
                                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                                        disabled={item.qty <= 1}
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <input type="text" value={item.qty} readOnly className="w-10 text-center border-gray-300 text-sm font-semibold" />
                                                    <button
                                                        onClick={() => updateQty(item, Math.min(item.countInStock, item.qty + 1))}
                                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                                        disabled={item.qty >= item.countInStock}
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <button onClick={() => removeFromCartHandler(item.product, item.name)} className="font-semibold text-sm hover:text-primary uppercase">Remove</button>
                                                <button className="font-semibold text-sm hover:text-primary uppercase hidden sm:block">Save for Later</button>
                                            </div>
                                        </div>

                                        {/* Delivery Info */}
                                        <div className="text-xs sm:text-sm md:w-48 pt-2 sm:pt-0 sm:text-right">
                                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
                                                <span className="text-gray-600">Delivery by {deliveryDate.toLocaleDateString('en-US', dateOptions)}</span>
                                                <span className="text-green-600 font-bold">Free</span>
                                                <span className="text-gray-400 line-through text-xs md:hidden">₹40</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Desktop Place Order Sticky Bar */}
                                <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] sticky bottom-0 bg-white z-10 md:static md:shadow-none border-t border-gray-100">
                                    <div className="hidden md:flex flex-col">
                                        <span className="text-gray-500 text-xs">Total Amount</span>
                                        <span className="font-bold text-xl text-gray-900">₹{finalAmount}</span>
                                    </div>
                                    <button
                                        onClick={checkoutHandler}
                                        className="bg-[#fb641b] text-white px-12 py-3.5 sm:py-4 font-bold uppercase rounded-sm shadow-md hover:shadow-lg hover:bg-[#e85d19] transition w-full md:w-auto text-sm md:text-base animate-pulse hover:animate-none"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Price Summary & Coupons (Sticky on Desktop) */}
                <div className="lg:w-1/3 space-y-4">

                    {/* Coupon Section */}
                    <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200">
                        <h2 className="text-gray-900 font-bold text-sm mb-3">Apply Coupons</h2>
                        {appliedCoupon ? (
                            <div className="flex justify-between items-center bg-green-50 p-3 rounded border border-green-200">
                                <div>
                                    <span className="text-green-700 font-bold text-sm">{appliedCoupon.code}</span>
                                    <span className="text-green-600 font-medium text-xs ml-2">Applied!</span>
                                </div>
                                <button onClick={removeCouponHandler} className="text-red-500 text-xs font-bold hover:underline">Remove</button>
                            </div>
                        ) : (
                            <div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-primary uppercase placeholder-normal"
                                    />
                                    <button
                                        onClick={applyCouponHandler}
                                        disabled={!couponCode || couponLoading || cartItems.length === 0}
                                        className="bg-gray-800 text-white font-bold px-4 py-2 text-sm rounded-sm hover:bg-gray-700 disabled:opacity-50 transition"
                                    >
                                        {couponLoading ? '...' : 'Apply'}
                                    </button>
                                </div>
                                {couponError && <p className="text-red-500 text-xs mt-2 font-medium">{couponError}</p>}
                            </div>
                        )}
                    </div>

                    {/* Price Details */}
                    <div className="bg-white p-0 rounded-sm shadow-sm sticky top-20 border border-gray-200">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-gray-500 font-bold uppercase text-sm">Price Details</h2>
                        </div>

                        <div className="p-4 space-y-4 text-sm text-gray-800">
                            <div className="flex justify-between">
                                <span>Price ({totalItems} items)</span>
                                <span>₹{totalOriginalPrice}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>- ₹{discount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Charges</span>
                                <span className={deliveryCharges === 0 ? 'text-green-600' : ''}>
                                    {deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges}`}
                                </span>
                            </div>

                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600 font-bold">
                                    <span>Coupon ({appliedCoupon.code})</span>
                                    <span>- ₹{appliedCoupon.discountAmount}</span>
                                </div>
                            )}

                            <div className="border-t border-dashed border-gray-200 my-4 pt-4">
                                <div className="flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total Amount</span>
                                    <span>₹{finalAmount}</span>
                                </div>
                            </div>
                            <p className="text-green-600 font-bold text-xs">You will save ₹{totalSavings} on this order</p>
                        </div>

                        <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
                            <div className="flex items-center gap-2 mb-3 bg-green-50 p-2 rounded border border-green-100">
                                <ShieldCheck size={20} className="text-green-600" />
                                <span className="text-green-800 font-semibold">Safe and Secure Payments. 100% Authentic products.</span>
                            </div>
                            {/* Mock Payment Logos to build trust */}
                            <div className="flex gap-2 justify-center opacity-60">
                                <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold">VISA</div>
                                <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold">MC</div>
                                <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold">UPI</div>
                                <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold">RuPay</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartScreen;

