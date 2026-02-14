import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Send, ArrowLeft, User, CheckCircle } from 'lucide-react';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const ENDPOINT = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'; // Adjust for production

const AdminChatDetailsScreen = () => {
    const { userId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            const newSocket = io(ENDPOINT);
            setSocket(newSocket);

            // Join the specific user's room to listen and send messages
            newSocket.emit('join_room', userId);

            // Fetch initial history
            const fetchHistory = async () => {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    };
                    const { data } = await axios.get(`/api/chat/${userId}`, config);
                    if (data && data.messages) {
                        setMessages(data.messages);
                    }
                    setLoading(false);
                } catch (err) {
                    setError(err.response?.data?.message || err.message);
                    setLoading(false);
                }
            };
            fetchHistory();

            // Listen for any new messages in this room (from user or bot)
            newSocket.on('receive_message', (msg) => {
                setMessages((prev) => [...prev, msg]);
            });

            return () => newSocket.close();
        }
    }, [userInfo, userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket) return;

        const msgData = {
            userId: userId, // Target user
            message: newMessage,
            sender: 'admin'
        };

        // Emit admin message event
        socket.emit('admin_message', msgData);

        // Optimistically update UI
        // setMessages((prev) => [...prev, { ...msgData, timestamp: new Date() }]);

        setNewMessage('');
    };

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-100px)] flex flex-col">
            <Link to="/admin/chat" className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors">
                <ArrowLeft className="mr-2" size={20} /> Back to Chats
            </Link>

            <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3 text-blue-600">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Chat with User</h2>
                            <p className="text-xs text-gray-500">ID: {userId}</p>
                        </div>
                    </div>
                    <div className="text-green-600 flex items-center text-sm font-medium">
                        <CheckCircle size={16} className="mr-1" /> Active
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
                    {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                    <div
                                        className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'admin'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : msg.sender === 'bot'
                                                ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.message}
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                                        {msg.sender === 'bot' && <span className="font-bold mr-1">BOT •</span>}
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={submitHandler} className="p-4 bg-white border-t border-gray-200 flex gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Type your reply..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminChatDetailsScreen;
