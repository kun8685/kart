import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Check, X, Shield, Mail, User as UserIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const UserListScreen = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.get('/api/users', config);
            setUsers(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            fetchUsers();
        } else {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await axios.delete(`/api/users/${id}`, config);
                fetchUsers();
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Customers & Users</h1>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
                    Total Users: {users.length}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                            <tr>
                                <th className="p-4 border-b">ID</th>
                                <th className="p-4 border-b">User Info</th>
                                <th className="p-4 border-b">Role</th>
                                <th className="p-4 border-b">Joined Date</th>
                                <th className="p-4 border-b text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-xs text-gray-500 font-mono">#{user._id.substring(0, 8)}...</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                <UserIcon size={16} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                                                <a href={`mailto:${user.email}`} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                                                    <Mail size={10} /> {user.email}
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {user.isAdmin ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                                <Shield size={10} /> Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                Customer
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {user.createdAt ? user.createdAt.substring(0, 10) : 'N/A'}
                                    </td>
                                    <td className="p-4 text-right">
                                        {!user.isAdmin && (
                                            <button
                                                onClick={() => deleteHandler(user._id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserListScreen;
