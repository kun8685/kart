import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { User, MapPin, CreditCard, Box, Check, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const OrderScreen = () => {
    const { id } = useParams();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
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

    if (loading) return <div>Loading...</div>;
    if (!order) return <div>Order not Found</div>;

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
            alert('Razorpay SDK failed to load. Are you online?');
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
            const { data: orderData } = await axios.post('/api/payment/razorpay', {
                amount: order.totalPrice,
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
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: order.user.name,
                    email: order.user.email,
                },
                theme: {
                    color: '#f59e0b', // Example primary color
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            alert('Something went wrong with Payment' + error.message);
        }
    };

    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className={isAdminRoute ? "" : "container mx-auto px-4 py-8 bg-gray-50 min-h-screen"}>
            {isAdminRoute && (
                <Link to="/admin/orderlist" className="flex items-center text-gray-500 hover:text-primary mb-6">
                    <ArrowLeft size={18} className="mr-1" /> Back to Orders
                </Link>
            )}
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Order #{order._id}</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                    <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2 flex items-center gap-2">
                            <User size={20} /> Shipping
                        </h2>
                        <p className="text-gray-600 mb-2"><strong>Name: </strong> {order.user.name}</p>
                        <p className="text-gray-600 mb-2"><strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-blue-500">{order.user.email}</a></p>
                        <p className="text-gray-600 mb-4">
                            <strong>Address: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {order.isDelivered ? (
                            <div className="bg-green-100 text-green-700 px-4 py-2 rounded flex items-center gap-2">
                                <Check size={18} /> Delivered on {order.deliveredAt ? order.deliveredAt.substring(0, 10) : ''}
                            </div>
                        ) : (
                            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded flex items-center gap-2">
                                <Clock size={18} /> Not Delivered (Processing)
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2 flex items-center gap-2">
                            <CreditCard size={20} /> Payment Method
                        </h2>
                        <p className="text-gray-600 mb-4">
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <div className="bg-green-100 text-green-700 px-4 py-2 rounded flex items-center gap-2">
                                <Check size={18} /> Paid on {order.paidAt ? order.paidAt.substring(0, 10) : ''}
                            </div>
                        ) : (
                            <div className="bg-red-100 text-red-700 px-4 py-2 rounded flex items-center gap-2">
                                <AlertTriangle size={18} /> Not Paid
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2 flex items-center gap-2">
                            <Box size={20} /> Order Items
                        </h2>
                        {order.orderItems.length === 0 ? (
                            <p>Order is empty</p>
                        ) : (
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
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
                                <span>₹{order.totalPrice - order.taxPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{order.shippingPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (GST)</span>
                                <span>₹{order.taxPrice}</span>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-gray-300 pt-4 mb-6">
                            <div className="flex justify-between font-bold text-lg text-gray-800">
                                <span>Total</span>
                                <span>₹{order.totalPrice}</span>
                            </div>
                        </div>

                        {!order.isPaid && (
                            <button
                                onClick={displayRazorpay}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold shadow transition uppercase tracking-wide mb-4"
                            >
                                Pay Now
                            </button>
                        )}

                        {userInfo && userInfo.isAdmin && !order.isDelivered && (
                            <button
                                onClick={deliverHandler}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-bold shadow transition uppercase tracking-wide mb-4"
                            >
                                Mark As Delivered
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderScreen;
