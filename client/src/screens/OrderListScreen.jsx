import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Check, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const OrderListScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            const fetchOrders = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                    };
                    const { data } = await axios.get('/api/orders', config);
                    setOrders(data);
                    setLoading(false);
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
                }
            };
            fetchOrders();
        } else {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
                        <tr>
                            <th className="p-4 border-b">Order ID</th>
                            <th className="p-4 border-b">User</th>
                            <th className="p-4 border-b">Date</th>
                            <th className="p-4 border-b">Total</th>
                            <th className="p-4 border-b">Paid</th>
                            <th className="p-4 border-b">Delivered</th>
                            <th className="p-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-500">{order._id}</td>
                                <td className="p-4 font-medium text-gray-800">{order.user && order.user.name}</td>
                                <td className="p-4 text-gray-600">{order.createdAt.substring(0, 10)}</td>
                                <td className="p-4 text-gray-800 font-bold">₹{order.totalPrice}</td>
                                <td className="p-4">
                                    {order.isPaid ? (
                                        <span className="text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded text-xs">
                                            {order.paidAt.substring(0, 10)}
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-semibold bg-red-100 px-2 py-0.5 rounded text-xs"><X size={16} /></span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {order.isDelivered ? (
                                        <span className="text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded text-xs">
                                            {order.deliveredAt.substring(0, 10)}
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-semibold bg-red-100 px-2 py-0.5 rounded text-xs"><X size={16} /></span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <Link to={`/admin/order/${order._id}`} className="text-gray-500 hover:text-primary">
                                        <Eye size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderListScreen;
