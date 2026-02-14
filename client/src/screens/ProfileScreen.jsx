import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, X, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            setName(userInfo.name);
            setEmail(userInfo.email);
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

    const updateProfileHandler = (e) => {
        e.preventDefault();
        alert('Profile Updated Successfully!');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Update Form */}
                <div className="md:w-1/3">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">User Profile</h2>
                    <form onSubmit={updateProfileHandler} className="bg-white p-6 rounded shadow-sm border border-gray-100 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 rounded font-bold shadow hover:bg-blue-600 transition"
                        >
                            Update Profile
                        </button>
                    </form>

                    <div className="mt-6 bg-white p-6 rounded shadow-sm border border-gray-100">
                        <h3 className="font-bold flex items-center gap-2 mb-3"><MapPin size={20} /> Saved Addresses</h3>
                        <p className="text-sm text-gray-600 mb-2">123, Gandhi Road, Mumbai, Maharashtra - 400001</p>
                        <button className="text-primary text-sm font-semibold hover:underline">Manage Addresses</button>
                    </div>
                </div>

                {/* My Orders */}
                <div className="md:w-2/3">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
                    {orders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Paid</th>
                                        <th className="p-4">Delivered</th>
                                        <th className="p-4">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 text-sm">
                                            <td className="p-4">{order._id.substring(0, 10)}...</td>
                                            <td className="p-4">{order.createdAt.substring(0, 10)}</td>
                                            <td className="p-4 font-bold">₹{order.totalPrice}</td>
                                            <td className="p-4">
                                                {order.isPaid ? (
                                                    <span className="text-green-600 flex items-center gap-1"><Check size={16} /> {order.paidAt.substring(0, 10)}</span>
                                                ) : (
                                                    <span className="text-red-500 flex items-center gap-1"><X size={16} /> No</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {order.isDelivered ? (
                                                    <span className="text-green-600 flex items-center gap-1"><Check size={16} /> {order.deliveredAt.substring(0, 10)}</span>
                                                ) : (
                                                    <span className="text-yellow-600">On Way</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <Link to={`/order/${order._id}`} className="text-primary hover:underline">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
