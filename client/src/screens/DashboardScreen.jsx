import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Package, ShoppingBag, TrendingUp, AlertTriangle, Loader, BarChart2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
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
    const [salesData, setSalesData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
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
                    totalProducts, // Use the calculated total
                    totalUsers,
                    lowStockProducts: lowStockCount,
                });

                // Compute Sales Data (Last 14 days of activity)
                const salesByDate = {};
                orders.forEach(order => {
                    const dateObj = new Date(order.createdAt);
                    const date = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    // Default to 0 if not exists
                    if (!salesByDate[date]) salesByDate[date] = { sales: 0, orders: 0 };

                    salesByDate[date].orders += 1;
                    if (order.isPaid || order.paymentMethod === 'COD') {
                        salesByDate[date].sales += order.totalPrice;
                    }
                });

                // Convert to array and sort by date. Assuming orders are sorted or we just take keys
                // Better approach: sort dates properly, or just use the chronological order from sorted orders
                const sortedOrdersForChart = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                const chronosMap = new Map();
                sortedOrdersForChart.forEach(order => {
                    const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    if (!chronosMap.has(date)) chronosMap.set(date, { name: date, sales: 0, orders: 0 });
                    const entry = chronosMap.get(date);
                    entry.orders += 1;
                    if (order.isPaid || order.paymentMethod === 'COD') {
                        entry.sales += order.totalPrice;
                    }
                });

                const finalSalesData = Array.from(chronosMap.values()).slice(-14); // Last 14 active days
                setSalesData(finalSalesData);

                // Compute Order Status Data
                const statusCounts = {};
                orders.forEach(order => {
                    const status = order.isDelivered ? 'Delivered' : (order.status || 'Processing');
                    statusCounts[status] = (statusCounts[status] || 0) + 1;
                });
                const finalStatusData = Object.keys(statusCounts).map(key => ({
                    name: key,
                    value: statusCounts[key]
                }));
                setStatusData(finalStatusData);

                // Compute Top Products
                const productSales = {};
                orders.forEach(order => {
                    if (order.isPaid || order.paymentMethod === 'COD') {
                        order.orderItems.forEach(item => {
                            if (!productSales[item.product]) {
                                productSales[item.product] = {
                                    name: item.name,
                                    qty: 0,
                                    revenue: 0,
                                    image: item.image
                                };
                            }
                            productSales[item.product].qty += item.qty;
                            productSales[item.product].revenue += (item.price * item.qty);
                        });
                    }
                });

                const topProductsArray = Object.values(productSales)
                    .sort((a, b) => b.qty - a.qty)
                    .slice(0, 5);
                setTopProducts(topProductsArray);

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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary" /> Sales Trend (Recent Days)
                        </h2>
                    </div>
                    <div className="h-72">
                        {salesData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2874f0" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2874f0" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `₹${value}`} />
                                    <RechartsTooltip
                                        formatter={(value) => [`₹${value}`, 'Revenue']}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="sales" stroke="#2874f0" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">Not enough data for chart</div>
                        )}
                    </div>
                </div>

                {/* Status Pie Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <BarChart2 size={20} className="text-primary" /> Orders by Status
                    </h2>
                    <div className="h-64 flex justify-center items-center">
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => {
                                            const COLORS = ['#2874f0', '#00C49F', '#FFBB28', '#FF8042', '#a855f7'];
                                            return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                                        })}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-gray-400">No Orders yet</div>
                        )}
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

                    {/* Top Selling Products */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <Package className="text-primary" size={24} />
                            <h2 className="text-lg font-bold text-gray-800">Top Selling Products</h2>
                        </div>
                        <div className="space-y-4">
                            {topProducts.length === 0 ? (
                                <p className="text-gray-500 text-sm py-4 text-center">Not enough data to determine top products.</p>
                            ) : (
                                topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-gray-100 rounded-md p-1 border border-gray-200">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm line-clamp-1" title={product.name}>{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.qty} units sold</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">₹{product.revenue.toLocaleString('en-IN')}</p>
                                            <p className="text-xs text-gray-400">Revenue</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;
