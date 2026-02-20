import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Package, Clock, CheckCircle, XCircle, ChevronRight, Truck } from 'lucide-react';

const MyOrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            setLoading(false);
            navigate('/login');
        } else {
            const fetchOrders = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                    };
                    const { data } = await axios.get('/api/orders/myorders', config);
                    setOrders(data);
                    setLoading(false);
                } catch (error) {
                    console.error(error);
                    setLoading(false);
                }
            };
            fetchOrders();
        }
    }, [navigate, userInfo]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Package className="text-primary" /> My Orders
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <Package size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-600">No orders yet</h2>
                    <p className="text-gray-400 mb-6">Looks like you haven't placed any orders yet.</p>
                    <Link to="/" className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow hover:bg-blue-700 transition">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link
                            to={`/order/${order._id}`}
                            key={order._id}
                            className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">ORDER ID: {order._id}</p>
                                    <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <ChevronRight className="text-gray-300 group-hover:text-primary transition" />
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                {order.orderItems.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="relative w-16 h-16 bg-gray-50 rounded-lg p-1 border border-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        {idx === 2 && order.orderItems.length > 3 && (
                                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                                +{order.orderItems.length - 2}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                <span className="font-bold text-gray-800">₹{order.totalPrice}</span>

                                <div className="flex items-center gap-2">
                                    {order.isDelivered ? (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <CheckCircle size={14} /> Delivered
                                        </span>
                                    ) : (
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Truck size={14} /> {order.status || 'Processing'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersScreen;
