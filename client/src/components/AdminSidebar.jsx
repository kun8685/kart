import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    MessageCircle
} from 'lucide-react';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/productlist', name: 'Products', icon: <Package size={20} /> },
        { path: '/admin/orderlist', name: 'Orders', icon: <ShoppingCart size={20} /> },
        { path: '/admin/userlist', name: 'Customers', icon: <Users size={20} /> },
        { path: '/admin/chat', name: 'Support Chat', icon: <MessageCircle size={20} /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo / Header */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
                    <Link to="/" className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-primary">Gaury</span>Kart
                    </Link>
                    <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                                ? 'bg-blue-50 text-primary'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            {/* Icon Wrapper */}
                            <span className={`${isActive(item.path) ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`}>
                                {React.cloneElement(item.icon, {
                                    color: isActive(item.path) ? '#2874f0' : 'currentColor'
                                })}
                            </span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Footer / Account Link */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50">
                    <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                        <Settings size={20} />
                        <span>Site Settings</span>
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
