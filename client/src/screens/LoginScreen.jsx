import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/authSlice';
import { Mail, Lock, Loader, ShoppingBag } from 'lucide-react';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error, userInfo } = useSelector((state) => state.auth);

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-white rounded shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* Left Side - Banner */}
                <div className="bg-primary w-full md:w-2/5 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="z-10">
                        <h2 className="text-3xl font-bold mb-4">Login</h2>
                        <p className="text-lg text-gray-100 mb-6">Get access to your Orders, Wishlist and Recommendations</p>
                    </div>
                    <div className="z-10 mt-auto hidden md:block">
                        <ShoppingBag size={120} className="text-blue-400 opacity-30 absolute bottom-10 left-10" />
                    </div>
                    {/* Decorative Circles */}
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-400 rounded-full opacity-20 blur-xl"></div>
                    <div className="absolute top-20 -right-20 w-40 h-40 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                    {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm">{error}</div>}

                    <form className="space-y-6" onSubmit={submitHandler}>
                        <div className="relative border-b-2 border-gray-200 focus-within:border-primary transition-colors">
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none focus:ring-0 placeholder-transparent peer pt-4 pb-1"
                                placeholder="Enter Email/Mobile number"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label
                                htmlFor="email-address"
                                className="absolute left-2 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                            >
                                Enter Email/Mobile number
                            </label>
                        </div>

                        <div className="relative border-b-2 border-gray-200 focus-within:border-primary transition-colors">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none focus:ring-0 placeholder-transparent peer pt-4 pb-1"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-2 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-1 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                            >
                                Enter Password
                            </label>
                            <div className="absolute right-0 top-2 text-primary font-bold text-xs cursor-pointer hover:underline">Forgot?</div>
                        </div>

                        <div className="text-xs text-gray-500 mt-4">
                            By continuing, you agree to Gaurykart's <span className="text-primary cursor-pointer hover:underline">Terms of Use</span> and <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold shadow-sm text-white bg-[#fb641b] hover:bg-[#e85d19] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition disabled:opacity-50 uppercase tracking-wide"
                        >
                            {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Login'}
                        </button>

                        <div className="text-center mt-6">
                            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-primary font-bold text-sm hover:underline">
                                New to Gaurykart? Create an account
                            </Link>
                        </div>

                        <div className="mt-8 text-center text-xs text-gray-400">
                            Debug: admin@example.com / 123456
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
