import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User, X, ChevronDown, Package, Heart, LogOut } from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const [keyword, setKeyword] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
        setIsProfileOpen(false);
    };

    const categories = [
        "Mobiles", "Fashion", "Electronics", "Home & Furniture", "Appliances", "Toys", "Beauty"
    ];

    return (
        <div className="flex flex-col w-full z-50 sticky top-0">
            {/* Main Header */}
            <header className="bg-primary text-white shadow-lg">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">

                    {/* Mobile Menu & Logo */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            className="lg:hidden p-1 hover:bg-white/10 rounded"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <Link to="/" className="flex flex-col leading-none group">
                            <span className="text-xl md:text-2xl font-bold italic tracking-wide group-hover:text-gray-100 transition">
                                Gaury<span className="text-yellow-400">kart</span>
                            </span>
                            <span className="text-[10px] md:text-xs italic text-gray-200 hover:text-yellow-400 font-medium flex items-center gap-0.5">
                                Explore <span className="text-yellow-400 font-bold">Premium</span> <span className="text-yellow-400">+</span>
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar - Big & Central */}
                    <form onSubmit={submitHandler} className="hidden md:flex flex-1 max-w-2xl relative shadow-md rounded-sm bg-white">
                        <input
                            type="text"
                            placeholder="Search for products, brands and more"
                            className="w-full px-4 py-2.5 text-sm text-gray-800 focus:outline-none rounded-l-sm"
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="submit" className="px-5 text-primary font-bold bg-white hover:bg-gray-50 rounded-r-sm border-l border-gray-100">
                            <Search size={20} />
                        </button>
                    </form>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-6 font-medium whitespace-nowrap">

                        {/* Login / User Dropdown */}
                        <div className="relative group">
                            {userInfo ? (
                                <button className="flex items-center gap-1 font-semibold hover:text-gray-100 py-1" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                    <span>{userInfo.name?.split(' ')[0]}</span>
                                    <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>
                            ) : (
                                <Link to="/login" className="bg-white text-primary px-8 py-1 font-bold rounded-sm hover:bg-gray-50 shadow-sm border border-white transition">
                                    Login
                                </Link>
                            )}

                            {/* Dropdown Menu */}
                            {(userInfo || isProfileOpen) && (
                                <div className="absolute right-0 top-full mt-1 w-60 bg-white text-gray-800 shadow-xl rounded-b-md overflow-hidden hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="py-1">
                                        {userInfo ? (
                                            <>
                                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                                    <p className="text-xs text-gray-500">Hello,</p>
                                                    <p className="font-bold truncate">{userInfo.name}</p>
                                                </div>
                                                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm">
                                                    <User size={16} className="text-primary" /> My Profile
                                                </Link>
                                                {userInfo.isAdmin && (
                                                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm">
                                                        <Package size={16} className="text-primary" /> Dashboard
                                                    </Link>
                                                )}
                                                <Link to="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm">
                                                    <Package size={16} className="text-primary" /> Orders
                                                </Link>
                                                <div onClick={logoutHandler} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm cursor-pointer text-red-500 border-t border-gray-100">
                                                    <LogOut size={16} /> Logout
                                                </div>
                                            </>
                                        ) : (
                                            <div className="p-2">
                                                <Link to="/login" className="block text-center w-full py-2 bg-primary text-white font-bold rounded shadow-sm hover:bg-blue-600">
                                                    Login
                                                </Link>
                                                <div className="text-center mt-2 text-xs">New here? <Link to="/register" className="text-primary font-bold hover:underline">Sign Up</Link></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* More Options - Placeholder for generic links */}
                        {/* <div className="relative group cursor-pointer">
                            <span className="flex items-center gap-1 font-semibold hover:text-gray-100">
                                More <ChevronDown size={16} />
                            </span>
                        </div> */}

                        {/* Cart */}
                        <Link to="/cart" className="flex items-center gap-2 font-semibold hover:text-gray-100 group relative">
                            <div className="relative">
                                <ShoppingCart size={22} />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                        {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                    </span>
                                )}
                            </div>
                            <span>Cart</span>
                        </Link>
                    </nav>

                    {/* Mobile Search Icon & Cart */}
                    <div className="flex lg:hidden items-center gap-4">
                        <Link to="/cart" className="relative">
                            <ShoppingCart size={24} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-primary">
                                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Mobile Search Bar (Expanded) */}
                <div className="md:hidden px-2 pb-2">
                    <form onSubmit={submitHandler} className="flex relative bg-white rounded-sm h-10">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-3 text-sm text-gray-800 rounded-sm focus:outline-none"
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="submit" className="px-3 text-gray-500">
                            <Search size={18} />
                        </button>
                    </form>
                </div>
            </header>

            {/* Sub-Header / Categories Bar (Desktop Only for now, or scrollable on mobile) */}
            <div className="hidden md:block bg-white shadow-sm border-b border-gray-200 overflow-x-auto no-scrollbar">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between md:justify-center gap-6 md:gap-12 py-3 min-w-max">
                        {categories.map((cat, index) => (
                            <Link
                                key={index}
                                to={`/search/${cat}`}
                                className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap flex flex-col items-center gap-1 group transition"
                            >
                                <span className='group-hover:font-semibold'>{cat}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsMenuOpen(false)}>
                    <div className="bg-white w-4/5 h-full shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-primary text-white p-4 flex justify-between items-center">
                            <span className="font-bold text-lg flex items-center gap-2">
                                <User size={20} />
                                {userInfo ? `Hello, ${userInfo.name.split(' ')[0]}` : 'Login & Signup'}
                            </span>
                            <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
                        </div>

                        <div className="p-0">
                            {!userInfo && (
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block p-4 border-b font-semibold text-primary">Login / Sign Up</Link>
                            )}

                            <div className="py-2 border-b">
                                <h3 className="px-4 py-2 text-gray-500 uppercase text-xs font-bold">Shop By Category</h3>
                                {categories.map((cat) => (
                                    <Link key={cat} to={`/search/${cat}`} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                                        {cat}
                                    </Link>
                                ))}
                            </div>

                            <div className="py-2 border-b">
                                <h3 className="px-4 py-2 text-gray-500 uppercase text-xs font-bold">Account</h3>
                                {userInfo && (
                                    <>
                                        <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                                        <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                                        {userInfo.isAdmin && (
                                            <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">Admin Dashboard</Link>
                                        )}
                                        <button onClick={() => { logoutHandler(); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-50 font-semibold">Logout</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;

