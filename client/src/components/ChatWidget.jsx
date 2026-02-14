import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { MessageCircle, X, Send } from 'lucide-react';
import axios from 'axios';

const ENDPOINT = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'; // Adjust for production

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            const newSocket = io(ENDPOINT);
            setSocket(newSocket);

            newSocket.emit('join_room', userInfo._id);

            // Fetch chat history
            const fetchHistory = async () => {
                try {
                    const { data } = await axios.get(`/api/chat/${userInfo._id}`, {
                        headers: { Authorization: `Bearer ${userInfo.token}` }
                    });
                    if (data && data.messages) {
                        setMessages(data.messages);
                    }
                } catch (error) {
                    console.error("Failed to fetch chat history", error);
                }
            };
            fetchHistory();

            newSocket.on('receive_message', (message) => {
                setMessages((prev) => [...prev, message]);
            });

            return () => newSocket.close();
        }
    }, [userInfo]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && socket && userInfo) {
            const msgData = {
                userId: userInfo._id,
                message: message,
                sender: 'user'
            };

            // Optimistic update
            // setMessages((prev) => [...prev, { ...msgData, timestamp: new Date() }]);

            socket.emit('send_message', msgData);
            setMessage('');
        }
    };

    // if (!userInfo) return null; // Don't show chat if not logged in (or show login prompt)

    return (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
                >
                    <MessageCircle size={24} />
                </button>
            )}

            {isOpen && (
                <div className="bg-white rounded-lg shadow-2xl w-[calc(100vw-2rem)] sm:w-96 h-[50vh] sm:h-[32rem] flex flex-col overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                        <div>
                            <h3 className="font-bold">Chat Support</h3>
                            <p className="text-xs text-blue-100">Usually replies instantly</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
                            <X size={20} />
                        </button>
                    </div>

                    {!userInfo ? (
                        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-gray-50">
                            <MessageCircle size={48} className="text-blue-200 mb-4" />
                            <p className="text-gray-800 font-medium mb-2">Hello! 👋</p>
                            <p className="text-gray-500 text-sm mb-6">Please log in to start chatting with our support team.</p>
                            <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition w-full">
                                Login to Chat
                            </a>
                        </div>
                    ) : (
                        <>
                            {/* Messages Area */}
                            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                                {messages.length === 0 && (
                                    <p className="text-center text-gray-500 text-sm mt-4">Start a conversation with us!</p>
                                )}
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : msg.sender === 'admin'
                                                    ? 'bg-green-600 text-white rounded-bl-none'
                                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                                }`}
                                        >
                                            <p>{msg.message}</p>
                                            <span className={`text-[10px] block mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!message.trim()}
                                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
