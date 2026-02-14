import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Package, ShoppingBag, TrendingUp, AlertTriangle, Loader } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const DashboardScreen = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        lowStockProducts: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                // Fetch concurrent data
                const [ordersRes, productsRes, usersRes] = await Promise.all([
                    axios.get('/api/orders', config),
                    axios.get('/api/products?pageNumber=1', config), // Assuming getting all or page 1 enough for count if API sends total doc count
                    axios.get('/api/users', config)
                ]);

                const orders = ordersRes.data;
                const products = productsRes.data.products; // Adjusted based on ProductListScreen structure
                const users = usersRes.data;

                // Calculate Stats
                const totalSales = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
                const totalOrders = orders.length;
                const totalProducts = productsRes.data.pages * productsRes.data.pageSize || products.length; // Fallback logic
                const totalUsers = users.length;

                // Low stock logic (simple client side check on fetched products)
                const lowStockCount = products.filter(p => p.countInStock <= 5).length;

                setStats({
                    totalSales,
                    totalOrders,
                    totalProducts: products.length, // Displaying fetched count for now
                    totalUsers,
                    lowStockProducts: lowStockCount,
                });

                // Get 5 most recent orders
                setRecentOrders(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
                setLoading(false);

            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [userInfo, navigate]);

    // Calculate GST (Mock logic remains, but based on real sales)
    const gstCollected = stats.totalSales * 0.18;

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin text-primary" size={48} /></div>;
    if (error) return <div className="text-red-500 text-center py-10">Error: {error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-semibold uppercase">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">₹{stats.totalSales.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <TrendingUp size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-semibold uppercase">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                        <ShoppingBag size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-semibold uppercase">Products</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                        <Package size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-semibold uppercase">Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Finance & Alerts */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Financials Teaser */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Finance Overview</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Revenue</span>
                                <span className="font-bold">₹{stats.totalSales.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Est. GST (18%)</span>
                                <span className="font-bold text-red-500">₹{gstCollected.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Net Profit</span>
                                <span className="font-bold text-green-600">₹{(stats.totalSales - gstCollected).toLocaleString('en-IN')}</span>
                            </div>
                            <button className="w-full mt-4 bg-gray-800 text-white py-2 rounded text-xs uppercase font-bold hover:bg-gray-900">
                                Download Report
                            </button>
                        </div>
                    </div>

                    {/* Alerts & Notifications */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <AlertTriangle className="text-orange-500" size={24} />
                            <h2 className="text-lg font-bold text-gray-800">Inventory Alerts</h2>
                        </div>
                        {stats.lowStockProducts > 0 ? (
                            <div className="space-y-3">
                                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 text-orange-700 text-sm">
                                    <p className="font-bold">Attention Needed</p>
                                    <p>{stats.lowStockProducts} Products are running low on stock (less than 5 units).</p>
                                    <Link to="/admin/productlist" className="underline mt-2 inline-block">View Inventory</Link>
                                </div>
                            </div>
                        ) : (
                            <p className="text-green-600 bg-green-50 p-4 rounded border-l-4 border-green-500">Inventory looks good! No low stock alerts.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Recent Orders */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                            <Link to="/admin/orderlist" className="text-primary text-sm font-semibold hover:underline">View All</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b text-gray-500 uppercase text-xs">
                                        <th className="pb-3">Order ID</th>
                                        <th className="pb-3">Date</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3">Total</th>
                                        <th className="pb-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center py-4 text-gray-500">No recent orders</td></tr>
                                    ) : (
                                        recentOrders.map((order) => (
                                            <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="py-3 font-mono text-gray-600">#{order._id.substring(0, 8)}...</td>
                                                <td className="py-3 text-gray-600">{order.createdAt.substring(0, 10)}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {order.isDelivered ? 'Delivered' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="py-3 font-medium text-gray-900">₹{order.totalPrice}</td>
                                                <td className="py-3 text-right">
                                                    <Link to={`/admin/order/${order._id}`} className="text-primary hover:text-blue-700 font-medium">View</Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;
