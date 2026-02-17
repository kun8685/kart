import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, CreditCard, Heart, Bell, Power, ChevronRight, Edit2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logout } from '../slices/authSlice'; // Correct import path for logout

const ProfileScreen = () => {
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'address', 'orders'
    const { userInfo } = useSelector((state) => state.auth);

    // const [name, setName] = useState(userInfo?.name || '');
    // const [email, setEmail] = useState(userInfo?.email || '');
    // Use userInfo directly since editing is disabled or handled elsewhere
    const name = userInfo?.name || '';
    const email = userInfo?.email || '';
    const [orders, setOrders] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();



    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            // Fetch Orders
            const fetchOrders = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${userInfo.token}`,
                        },
                    };
                    const { data } = await axios.get('/api/orders/myorders', config);
                    setOrders(data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchOrders();
        }
    }, [navigate, userInfo]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const renderSidebar = () => (
        <div className="bg-white shadow w-full md:w-1/4 min-h-[500px] flex flex-col">
            {/* User Info Header */}
            <div className="p-4 border-b flex items-center gap-3 bg-gray-50">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">
                    {name.charAt(0)}
                </div>
                <div>
                    <div className="text-xs text-gray-500">Hello,</div>
                    <div className="font-bold text-gray-800">{name}</div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto">
                <div className="border-b">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center justify-between p-4 hover:bg-blue-50 transition-colors ${activeTab === 'orders' ? 'text-primary font-bold bg-blue-50' : 'text-gray-600'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Package size={20} />
                            <span>MY ORDERS</span>
                        </div>
                        <ChevronRight size={16} />
                    </button>
                </div>

                <div className="border-b pb-2">
                    <div className="p-4 text-xs font-bold text-gray-400 flex items-center gap-2">
                        <User size={16} /> ACCOUNT SETTINGS
                    </div>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full text-left pl-12 pr-4 py-3 text-sm hover:bg-gray-50 hover:text-primary transition ${activeTab === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                    >
                        Profile Information
                    </button>
                    <button
                        onClick={() => setActiveTab('address')}
                        className={`w-full text-left pl-12 pr-4 py-3 text-sm hover:bg-gray-50 hover:text-primary transition ${activeTab === 'address' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
                    >
                        Manage Addresses
                    </button>
                    <button className="w-full text-left pl-12 pr-4 py-3 text-sm text-gray-400 cursor-not-allowed">
                        PAN Card Information
                    </button>
                </div>

                <div className="border-b pb-2">
                    <div className="p-4 text-xs font-bold text-gray-400 flex items-center gap-2">
                        <CreditCard size={16} /> PAYMENTS
                    </div>
                    <button className="w-full text-left pl-12 pr-4 py-3 text-sm text-gray-400 cursor-not-allowed">Gift Cards</button>
                    <button className="w-full text-left pl-12 pr-4 py-3 text-sm text-gray-400 cursor-not-allowed">Saved UPI Payment</button>
                    <button className="w-full text-left pl-12 pr-4 py-3 text-sm text-gray-400 cursor-not-allowed">Saved Cards</button>
                </div>

                <div className="border-b pb-2">
                    <div className="p-4 text-xs font-bold text-gray-400 flex items-center gap-2">
                        <Heart size={16} /> MY STUFF
                    </div>
                    <button className="w-full text-left pl-12 pr-4 py-3 text-sm text-gray-400 cursor-not-allowed">My Coupons</button>
                    <button className="w-full text-left pl-12 pr-4 py-3 text-sm text-gray-400 cursor-not-allowed">My Reviews & Ratings</button>
                    <button className="w-full text-left pl-12 pr-4 py-3 text-sm text-gray-400 cursor-not-allowed">My Wishlist</button>
                </div>

                <div className="p-4 border-b">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 text-gray-600 hover:text-primary text-sm font-semibold">
                        <Power size={18} /> Logout
                    </button>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        if (activeTab === 'orders') {
            return (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">My Orders ({orders.length})</h2>
                    {orders.length === 0 ? (
                        <div className="text-center py-10">
                            <Package size={48} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-gray-500">No orders found.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <Link to={`/order/${order._id}`} key={order._id} className="block bg-white border hover:shadow-md transition p-4 rounded-sm flex flex-col sm:flex-row gap-4">
                                <div className="w-20 h-20 bg-gray-50 flex-shrink-0 p-2 flex items-center justify-center">
                                    <img src={order.orderItems[0].image} alt="product" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{order.orderItems[0].name}</h3>
                                            {order.orderItems.length > 1 && <span className="text-xs text-gray-500">+{order.orderItems.length - 1} more items</span>}
                                        </div>
                                        <span className="font-bold text-gray-800">₹{order.totalPrice}</span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-sm">
                                        <div className={`w-2 h-2 rounded-full ${order.isDelivered ? 'bg-green-500' : 'bg-primary'}`}></div>
                                        <span className="font-medium text-gray-700">
                                            {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'On the Way'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            );
        }

        if (activeTab === 'address') {
            return (
                <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-6">Manage Addresses</h2>
                    <div className="border rounded p-4 flex justify-between items-start bg-gray-50">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 text-[10px] font-bold rounded uppercase">Home</span>
                                <span className="font-bold text-gray-800">{name}</span>
                                <span className="text-gray-800 font-bold ml-2">{userInfo.phone || '9876543210'}</span>
                            </div>
                            <p className="text-sm text-gray-600 w-3/4">
                                123, Gandhi Road, Civil Lines, Agatha, Maharashtra - 400001
                            </p>
                        </div>
                        <div className="relative group">
                            <button className="text-primary font-bold text-sm">EDIT</button>
                        </div>
                    </div>
                    <button className="mt-4 w-full border border-gray-200 py-3 text-primary font-bold hover:bg-blue-50 transition">
                        + ADD A NEW ADDRESS
                    </button>
                </div>
            );
        }

        // Profile Tab (Default)
        return (
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">Personal Information <span className="text-primary text-sm font-semibold cursor-pointer hover:underline ml-4">Edit</span></h2>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex gap-4">
                        <div className="w-full">
                            <label className="text-xs text-gray-400 block mb-1">First Name</label>
                            <input disabled value={name.split(' ')[0]} className="w-full bg-gray-50 border p-2 rounded text-gray-700 cursor-not-allowed" />
                        </div>
                        <div className="w-full">
                            <label className="text-xs text-gray-400 block mb-1">Last Name</label>
                            <input disabled value={name.split(' ')[1] || ''} className="w-full bg-gray-50 border p-2 rounded text-gray-700 cursor-not-allowed" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-bold text-gray-800">Gender</label>
                            <div className="flex gap-4 text-sm text-gray-600">
                                <label className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded cursor-pointer border border-transparent hover:border-gray-200"><input type="radio" name="gender" disabled /> Male</label>
                                <label className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded cursor-pointer border border-transparent hover:border-gray-200"><input type="radio" name="gender" disabled /> Female</label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">Email Address <span className="text-primary text-sm font-semibold cursor-pointer hover:underline ml-4">Edit</span></h2>
                        <div className="w-full">
                            <input disabled value={email} className="w-full bg-gray-50 border p-2 rounded text-gray-700 cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">Mobile Number <span className="text-primary text-sm font-semibold cursor-pointer hover:underline ml-4">Edit</span></h2>
                        <div className="w-full">
                            <input disabled value="+91 9876543210" className="w-full bg-gray-50 border p-2 rounded text-gray-700 cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase">FAQs</h2>
                        <div className="text-xs text-gray-500 space-y-3">
                            <p className="font-semibold text-gray-800">What happens when I update my email address (or mobile number)?</p>
                            <p>Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8 font-sans">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Sidebar */}
                    {renderSidebar()}

                    {/* Main Content */}
                    <div className="flex-1 bg-white shadow min-h-[500px] p-6">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
