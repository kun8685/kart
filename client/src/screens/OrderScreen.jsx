import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { User, MapPin, CreditCard, ShoppingBag, CheckCircle, Clock, XCircle, ArrowLeft, Truck, PackageCheck, Receipt, Download, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';


const OrderScreen = () => {
    const { id } = useParams();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trackingId, setTrackingId] = useState('');
    const [courierName, setCourierName] = useState('');
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get(`/api/orders/${id}`, config);
                setOrder(data);
                if (data.trackingId) setTrackingId(data.trackingId);
                if (data.courierName) setCourierName(data.courierName);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (!order) {
            fetchOrder();
        }
    }, [id, order, userInfo]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!order) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-500">
            <XCircle size={64} className="mb-4 text-red-400" />
            <span className="text-xl font-medium">Order not Found</span>
            <Link to="/" className="mt-4 text-primary hover:underline">Return Home</Link>
        </div>
    );

    const deliverHandler = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.put(`/api/orders/${order._id}/deliver`, {}, config);
            setOrder({ ...order, isDelivered: true, deliveredAt: new Date().toISOString() });
        } catch (error) {
            console.error(error);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const displayRazorpay = async () => {
        const res = await loadRazorpay();

        if (!res) {
            alert('Payment SDK failed to load. Are you online?');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            // Get Razorpay Key
            const { data: { key } } = await axios.get('/api/payment/razorpay/key', config);

            // Create Order
            // Support both 'Online' and legacy 'Razorpay'
            const isOnline = order.paymentMethod === 'Online' || order.paymentMethod === 'Razorpay';
            const amountToPay = isOnline ? order.totalPrice : order.shippingPrice;

            const { data: orderData } = await axios.post('/api/payment/razorpay', {
                amount: amountToPay,
                receipt: order._id,
            }, config);

            const options = {
                key: key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'GauryKart',
                description: 'Payment for Order #' + order._id,
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        const verifyConfig = {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${userInfo.token}`,
                            },
                        };
                        await axios.post('/api/payment/razorpay/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: order._id,
                        }, verifyConfig);

                        setOrder({ ...order, isPaid: true, paidAt: new Date().toISOString() });
                        alert('Payment Successful');
                    } catch (error) {
                        console.error(error);
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: order.user.name,
                    email: order.user.email,
                },
                theme: {
                    color: '#2874f0', // Primary color
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            alert('Something went wrong with Payment: ' + error.message);
        }
    };

    const isAdminRoute = location.pathname.startsWith('/admin');

    // Date formatter
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isOnline = order.paymentMethod === 'Online' || order.paymentMethod === 'Razorpay';
    const paymentMethodDisplay = isOnline ? 'Online Payment' : order.paymentMethod;

    const updateStatusHandler = async (status) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.put(`/api/orders/${order._id}/tracking`, {
                status: status || order.status,
                courierName: courierName || order.courierName,
                trackingId: trackingId || order.trackingId
            }, config);
            setOrder(data);
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    return (
        <div className={isAdminRoute ? "p-4" : "container mx-auto px-4 py-12 bg-gray-50 min-h-screen font-sans"}>
            {isAdminRoute ? (
                <Link to="/admin/orderlist" className="flex items-center text-gray-500 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Back to Orders
                </Link>
            ) : (
                <Link to="/" className="flex items-center text-gray-500 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Continue Shopping
                </Link>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        Order <span className="text-gray-400">#{order._id.substring(0, 8)}...</span>
                    </h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        Placed on {formatDate(order.createdAt)}
                    </p>
                </div>
                {!isAdminRoute && (
                    <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium shadow-sm">
                        <Download size={16} /> Invoice
                    </button>
                )}
            </div>

            {/* Dynamic Tracking Timeline */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-x-auto">
                <div className="min-w-[700px]">
                    <TrackingTimeline order={order} />
                </div>
            </div>

            {isAdminRoute && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <User size={20} className="text-primary" /> Admin Status Control
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].map((status) => (
                            <button
                                key={status}
                                onClick={() => updateStatusHandler(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${order.status === status
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                Set {status}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wide">Courier Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Delhivery, BlueDart"
                                value={courierName}
                                onChange={(e) => setCourierName(e.target.value)}
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wide">Tracking ID (AWB)</label>
                            <input
                                type="text"
                                placeholder="Enter tracking Number"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <button
                            onClick={() => updateStatusHandler(order.status)}
                            className="bg-gray-800 text-white font-bold py-2 px-6 rounded shadow hover:bg-gray-700 transition"
                        >
                            Save Tracking
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-4">
                        * Setting a status manually overrides the automatic time-based progression.
                    </p>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Information */}
                <div className="lg:w-2/3 space-y-6">

                    {/* User & Shipping Info */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 border-b pb-4 mb-4 flex items-center gap-2">
                            <User size={20} className="text-primary" /> Customer & Shipping
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer Details</h3>
                                <p className="font-medium text-gray-900">{order.user.name}</p>
                                <a href={`mailto:${order.user.email}`} className="text-blue-500 text-sm hover:underline">{order.user.email}</a>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {order.shippingAddress.address}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                    {order.shippingAddress.country}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            {order.isDelivered ? (
                                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-full"><CheckCircle size={20} className="text-green-600" /></div>
                                    <div>
                                        <p className="font-bold">Delivered</p>
                                        <p className="text-xs">Package delivered on {formatDate(order.deliveredAt)}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-full"><Truck size={20} className="text-blue-600" /></div>
                                        <div>
                                            <p className="font-bold">Order Status: {order.status || 'Processing'}</p>
                                            <p className="text-xs">Your order is being processed and will be shipped soon.</p>
                                        </div>
                                    </div>

                                    {(order.courierName || order.trackingId) && (
                                        <div className="mt-2 border-t border-blue-200 pt-3 flex flex-wrap gap-4 text-sm bg-white/50 p-3 rounded-lg">
                                            {order.courierName && (
                                                <div>
                                                    <span className="text-gray-500 text-xs font-bold uppercase block">Courier</span>
                                                    <span className="font-medium">{order.courierName}</span>
                                                </div>
                                            )}
                                            {order.trackingId && (
                                                <div>
                                                    <span className="text-gray-500 text-xs font-bold uppercase block">Tracking ID</span>
                                                    <span className="font-medium tracking-wider">{order.trackingId}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 border-b pb-4 mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-primary" /> Payment Information
                        </h2>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                                <p className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                    {paymentMethodDisplay}
                                    {isOnline && <ShieldCheck size={16} className="text-green-500" />}
                                </p>
                            </div>

                            {order.isPaid ? (
                                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 self-start font-medium border border-green-200">
                                    <CheckCircle size={18} /> Paid {order.paidAt ? formatDate(order.paidAt) : ''}
                                </div>
                            ) : (
                                <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg flex items-center gap-2 self-start font-medium border border-yellow-200">
                                    <Clock size={18} /> Payment Pending
                                </div>
                            )}
                        </div>

                        {!isOnline && order.isPaid && (
                            <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200 flex items-center gap-2">
                                <Receipt size={16} />
                                <span>Note: Remaining Amount <strong>₹{(order.totalPrice - order.shippingPrice).toFixed(2)}</strong> to be paid on delivery.</span>
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800 border-b pb-4 mb-4 flex items-center gap-2">
                            <ShoppingBag size={20} className="text-primary" /> Order Items
                        </h2>
                        {order.orderItems.length === 0 ? (
                            <p className="text-gray-500 italic">Order is empty</p>
                        ) : (
                            <div className="space-y-6">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-gray-50 rounded-lg p-2 flex-shrink-0 border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1">
                                            <Link to={`/product/${item.product}`} className="font-medium text-gray-800 hover:text-primary line-clamp-1">
                                                {item.name}
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {item.qty} x ₹{item.price}
                                            </p>
                                        </div>
                                        <div className="font-bold text-gray-800">
                                            ₹{(item.qty * item.price).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Calculations & Actions */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wide border-b pb-2">
                            Order Summary
                        </h2>

                        <div className="space-y-4 text-sm text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-900">₹{order.totalPrice - order.taxPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="font-medium text-gray-900">₹{order.shippingPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (GST)</span>
                                <span className="font-medium text-gray-900">₹{order.taxPrice}</span>
                            </div>

                            {order.couponCode && (
                                <div className="flex justify-between text-green-600 font-bold bg-green-50 p-1 -mx-2 px-2 rounded mt-2">
                                    <span>Coupon ({order.couponCode})</span>
                                    <span>- ₹{order.couponDiscount}</span>
                                </div>
                            )}

                            <div className="border-t border-dashed border-gray-300 pt-4 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900 text-lg">Total</span>
                                    <span className="font-bold text-primary text-2xl">₹{order.totalPrice}</span>
                                </div>
                            </div>
                        </div>

                        {!order.isPaid && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded-xl border border-yellow-200 leading-relaxed">
                                    {isOnline
                                        ? "Please complete your payment to confirm the shipment."
                                        : `For Cash on Delivery, please pay the delivery charge of ₹${order.shippingPrice} now. The rest is collected at your doorstep.`}
                                </div>
                                <button
                                    onClick={displayRazorpay}
                                    className="w-full bg-primary hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all uppercase tracking-wide flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={20} />
                                    {isOnline ? `Pay Securely ₹${order.totalPrice}` : `Pay Delivery Fee ₹${order.shippingPrice}`}
                                </button>
                            </motion.div>
                        )}

                        {userInfo && userInfo.isAdmin && !order.isDelivered && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Admin Action</p>
                                <button
                                    onClick={deliverHandler}
                                    className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl font-bold shadow transition uppercase tracking-wide flex items-center justify-center gap-2"
                                >
                                    <Truck size={18} /> Mark As Delivered
                                </button>
                            </div>
                        )}

                        <div className="mt-6 text-center text-xs text-gray-400">
                            Need help? <a href="/contact" className="underline hover:text-gray-600">Contact Support</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const TrackingTimeline = ({ order }) => {
    // 0: Placed
    // 1: Processing
    // 2: Packed
    // 3: Shipped
    // 4: Out for Delivery
    // 5: Delivered

    const currentStep = React.useMemo(() => {
        if (order.isDelivered) return 5;
        if (order.status) {
            switch (order.status) {
                case 'Processing': return 1;
                case 'Packed': return 2;
                case 'Shipped': return 3;
                case 'Out for Delivery': return 4;
                case 'Delivered': return 5;
                default: return 0;
            }
        }

        // Automatic Time-based logic
        const created = new Date(order.createdAt).getTime();
        const now = new Date().getTime();
        const diffDays = (now - created) / (1000 * 60 * 60 * 24);

        if (diffDays < 1) return 1;
        if (diffDays < 3) return 2;
        if (diffDays < 12) return 3;
        if (diffDays < 14) return 4;
        return 5;
    }, [order]);

    const steps = [
        { label: 'Confirmed', icon: Receipt },
        { label: 'Processing', icon: Clock },
        { label: 'Packed', icon: PackageCheck },
        { label: 'On the Way', icon: Truck },
        { label: 'Out for Delivery', icon: MapPin },
        { label: 'Delivered', icon: CheckCircle },
    ];

    return (
        <div className="relative">
            {/* Progress Bar Background */}
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full -z-0"></div>

            {/* Active Progress Bar */}
            <div
                className="absolute top-5 left-0 h-1 bg-green-500 rounded-full transition-all duration-1000 -z-0"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>

            <div className="flex justify-between w-full">
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white transition-all duration-300
                                ${isCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400'}
                                ${isCurrent ? 'scale-110 ring-2 ring-green-500 ring-offset-2' : ''}
                            `}>
                                <step.icon size={18} />
                            </div>
                            <span className={`text-xs font-bold mt-2 uppercase tracking-wide transition-colors
                                ${isCompleted ? 'text-gray-800' : 'text-gray-400'}
                                ${isCurrent ? 'text-green-600' : ''}
                            `}>
                                {step.label}
                            </span>
                            {isCurrent && index === 3 && (
                                <span className="text-[10px] text-blue-500 mt-1 font-medium animate-pulse">In Transit</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderScreen;
