import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShieldCheck, MapPin } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const { userInfo } = useSelector((state) => state.auth);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    const updateQty = (item, newQty) => {
        if (newQty < 1) return;
        if (newQty > item.countInStock) return;
        dispatch(addToCart({ ...item, qty: newQty }));
    };

    const totalItems = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);
    const subtotal = cartItems.reduce((acc, item) => acc + Number(item.qty) * item.price, 0); // Renamed to subtotal for clarity
    const discount = Math.round(subtotal * 0.1); // Mock 10% discount

    // Shipping Logic
    // const standardShipping = subtotal > 500 ? 0 : 40; // Removed standard rule per user request
    const standardShipping = 0;
    const extraShipping = cartItems.reduce((acc, item) => acc + (item.shippingPrice || 0) * item.qty, 0);
    const deliveryCharges = standardShipping + extraShipping;

    const finalAmount = subtotal - discount + deliveryCharges;

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
                        <div className="text-center py-16 bg-white rounded-sm shadow-sm">
                            <img src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="h-40 mx-auto mb-4 opacity-50" />
                            <h2 className="text-xl font-semibold mb-2">Your cart is empty!</h2>
                            <p className="text-sm text-gray-500 mb-6">Add items to it now.</p>
                            <Link to="/" className="bg-primary text-white px-10 py-3 rounded-sm font-bold shadow-md hover:bg-blue-600 transition">Shop Now</Link>
                        </div>
                    ) : (
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

                                        <div className="text-xs text-gray-500 mb-2 mt-1">
                                            {item.variant ? `Size: ${item.variant}` : 'Standard'}
                                            <span className="mx-2">•</span>
                                            Seller: RetailNet
                                        </div>

                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-gray-500 line-through text-sm">₹{Math.round(item.price * 1.1)}</span>
                                            <span className="font-bold text-lg text-gray-900">₹{item.price}</span>
                                            <span className="text-green-600 text-sm font-bold">10% Off</span>
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
                                            <button onClick={() => removeFromCartHandler(item.product)} className="font-semibold text-sm hover:text-primary uppercase">Remove</button>
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

                            {/* Desktop Place Order Sticky Bar (Optional inside cart card, usually distinct) */}
                            <div className="p-4 flex justify-end shadow-[0_-2px_10px_rgba(0,0,0,0.05)] sticky bottom-0 bg-white z-10 md:static md:shadow-none">
                                <button
                                    onClick={checkoutHandler}
                                    className="bg-[#fb641b] text-white px-10 py-3 sm:py-3.5 font-bold uppercase rounded-sm shadow-sm hover:bg-[#e85d19] transition w-full md:w-auto"
                                >
                                    Place Order
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Price Summary (Sticky on Desktop) */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-0 rounded-sm shadow-sm sticky top-20 border border-gray-200">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-gray-500 font-bold uppercase text-sm">Price Details</h2>
                        </div>

                        <div className="p-4 space-y-4 text-sm text-gray-800">
                            <div className="flex justify-between">
                                <span>Price ({totalItems} items)</span>
                                <span>₹{subtotal}</span>
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

                            <div className="border-t border-dashed border-gray-200 my-4 pt-4">
                                <div className="flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total Amount</span>
                                    <span>₹{finalAmount}</span>
                                </div>
                            </div>
                            <p className="text-green-600 font-bold text-xs">You will save ₹{discount} on this order</p>
                        </div>

                        <div className="p-4 border-t border-gray-200 text-xs text-gray-400 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-gray-400" />
                            Safe and Secure Payments. 100% Authentic products.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartScreen;

