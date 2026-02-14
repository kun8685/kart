import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, ShoppingCart, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const MobileNav = () => {
    const location = useLocation();
    const { cartItems } = useSelector((state) => state.cart);

    // Hide mobile nav on product details page so "Add to Cart" buttons are visible
    if (location.pathname.startsWith('/product/')) {
        return null;
    }

    const navItems = [
        { name: 'Home', icon: Home, path: '/' },
        { name: 'Categories', icon: Layers, path: '/search/all' }, // Mock category path
        { name: 'Cart', icon: ShoppingCart, path: '/cart', badge: cartItems.length },
        { name: 'Account', icon: User, path: '/login' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-gray-500'}`}
                        >
                            <div className="relative">
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                {item.badge > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center border-2 border-white">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileNav;
