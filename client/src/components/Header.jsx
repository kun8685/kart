import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User, X, ChevronDown, Package, Heart, LogOut, LayoutGrid, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        "Electronics", "Fashion", "Home", "Beauty", "Appliances", "Toys", "Books", "Grocery", "Sports"
    ];

    return (
        <div className={`flex flex-col w-full z-50 sticky top-0 transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-none'}`}>
            {/* Top Notification Bar (Optional) */}
            <div className="bg-gray-900 text-white text-[10px] md:text-xs py-1.5 text-center font-medium tracking-wide">
                Free Shipping on Orders Over ₹499 | Easy Returns
            </div>

            {/* Main Header */}
            <header className="bg-white border-b border-gray-100 relative z-50">
                <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-8">

                    {/* Logo & Mobile Menu */}
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden text-gray-700 hover:text-primary transition"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>

                        <Link to="/" className="flex items-center gap-1 group">
                            <span className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 tracking-tighter group-hover:opacity-90 transition">
                                GAURY<span className="text-gray-800">KART</span>.
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar - Modern & Rounded */}
                    <form onSubmit={submitHandler} className="hidden md:flex flex-1 max-w-xl relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for products, brands and more..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-sm text-gray-800 rounded-full border border-transparent focus:border-primary focus:bg-white focus:ring-2 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400"
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </form>

                    {/* Icons / Navigation */}
                    <nav className="flex items-center gap-2 md:gap-6">

                        {/* Mobile Search Trigger (Visible only on small screens) */}
                        <button className="md:hidden text-gray-600 hover:text-gray-900">
                            <Search size={22} />
                        </button>

                        {/* Account Dropdown */}
                        <div className="relative group">
                            <button
                                className="flex items-center gap-2 text-gray-600 hover:text-primary font-medium py-2 rounded-lg transition"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 transition">
                                    <User size={20} />
                                </div>
                                <div className="hidden lg:flex flex-col items-start leading-none">
                                    <span className="text-[10px] text-gray-500 font-semibold uppercase">Account</span>
                                    <span className="text-sm font-bold text-gray-800">{userInfo ? userInfo.name.split(' ')[0] : 'Login'}</span>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden hidden group-hover:block transition-all transform origin-top-right z-50">
                                {userInfo ? (
                                    <div className="py-2">
                                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                            <p className="text-xs text-gray-500 font-semibold">Signed in as</p>
                                            <p className="text-sm font-bold text-gray-800 truncate">{userInfo.email}</p>
                                        </div>
                                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition">
                                            <User size={16} /> My Profile
                                        </Link>
                                        <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition">
                                            <Package size={16} /> Orders
                                        </Link>
                                        {userInfo.isAdmin && (
                                            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition">
                                                <LayoutGrid size={16} /> Dashboard
                                            </Link>
                                        )}
                                        <div className="border-t border-gray-50 mt-1">
                                            <button onClick={logoutHandler} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium transition">
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3">
                                        <Link to="/login" className="flex justify-center w-full py-2.5 mb-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 transition">
                                            Log In
                                        </Link>
                                        <p className="text-center text-xs text-gray-500">
                                            New customer? <Link to="/register" className="text-primary font-bold hover:underline">Sign Up</Link>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="flex items-center gap-2 text-gray-600 hover:text-primary font-medium group transition">
                            <div className="relative bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 transition">
                                <ShoppingCart size={20} />
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                        {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                    </span>
                                )}
                            </div>
                            <div className="hidden lg:flex flex-col items-start leading-none">
                                <span className="text-[10px] text-gray-500 font-semibold uppercase">My Cart</span>
                                <span className="text-sm font-bold text-gray-800">
                                    ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString()}
                                </span>
                            </div>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Sub-Header Categories - Clean Minimalist */}
            <div className="hidden md:block bg-white border-b border-gray-200/60 overflow-x-auto">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-8 py-3">
                        <div className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer hover:bg-blue-50 px-3 py-1.5 rounded-md transition">
                            <LayoutGrid size={18} />
                            <span>All Categories</span>
                        </div>
                        <div className="h-4 w-px bg-gray-300"></div>
                        {categories.map((cat, index) => (
                            <Link
                                key={index}
                                to={`/search/${cat}`}
                                className="text-sm font-medium text-gray-600 hover:text-primary hover:font-bold transition-all whitespace-nowrap"
                            >
                                {cat}
                            </Link>
                        ))}
                        <div className="h-4 w-px bg-gray-300"></div>
                        <Link to="/search/offers" className="flex items-center gap-1 text-red-500 font-bold text-sm hover:underline">
                            <Zap size={16} fill="currentColor" /> Offers
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Sidebar */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] flex">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="relative bg-white w-4/5 max-w-xs h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">

                        {/* Mobile Menu Header */}
                        <div className="p-5 bg-gradient-to-r from-primary to-blue-600 text-white flex justify-between items-start">
                            <div>
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold mb-3 backdrop-blur-sm border border-white/30">
                                    {userInfo ? userInfo.name.charAt(0) : <User size={24} />}
                                </div>
                                <h2 className="text-lg font-bold leading-tight">
                                    {userInfo ? `Hello, ${userInfo.name.split(' ')[0]}` : 'Welcome Guest'}
                                </h2>
                                {!userInfo && <Link to="/login" className="text-xs text-blue-100 hover:text-white underline mt-1 block">Login / Sign Up &rarr;</Link>}
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="text-white/80 hover:text-white"><X size={24} /></button>
                        </div>

                        {/* Mobile Menu Links */}
                        <div className="flex-1 overflow-y-auto py-2">
                            <div className="px-4 py-2">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shop</h3>
                                <div className="space-y-1">
                                    {categories.map((cat) => (
                                        <Link key={cat} to={`/search/${cat}`} onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition">
                                            {cat} <span className="text-gray-300">&rsaquo;</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 my-2"></div>

                            <div className="px-4 py-2">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Account</h3>
                                <div className="space-y-1">
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">
                                        <User size={18} /> Profile
                                    </Link>
                                    <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">
                                        <Package size={18} /> Orders
                                    </Link>
                                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">
                                        <ShoppingCart size={18} /> Cart
                                    </Link>
                                </div>
                            </div>

                            {userInfo && (
                                <div className="px-4 mt-4">
                                    <button onClick={() => { logoutHandler(); setIsMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition">
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;

