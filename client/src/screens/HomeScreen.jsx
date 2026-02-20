import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Star, Heart, Clock, Gift, Tag, X, Mail, Check } from 'lucide-react';
import { HomeSkeleton } from '../components/ProductSkeleton';

const ProductSection = ({ title, items, bg = "bg-white" }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className={`container mx-auto px-2 md:px-3 mb-4`}>
            <div className={`${bg} p-4 rounded-sm shadow-sm border border-gray-200 relative overflow-hidden`}>
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h2 className="text-lg md:text-xl font-medium text-gray-800">{title}</h2>
                    <Link to="/products" className="bg-primary text-white px-4 py-1.5 rounded-sm text-sm font-bold shadow-sm hover:shadow-md transition">VIEW ALL</Link>
                </div>

                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {items.map((product, idx) => (
                        <Link to={`/product/${product._id}`} key={idx} className="min-w-[150px] md:min-w-[180px] border border-gray-100 rounded-md p-3 hover:shadow-lg transition flex flex-col items-center text-center cursor-pointer bg-white group">
                            <div className="w-28 h-28 md:w-36 md:h-36 mb-3 relative">
                                <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition duration-300" />
                            </div>
                            <h3 className="text-xs md:text-sm font-medium text-gray-700 mb-1 truncate w-full" title={product.name}>{product.name}</h3>
                            <span className="text-gray-500 text-xs truncate w-full mb-1">{product.category}</span>
                            <span className="text-green-600 font-bold text-sm">From ₹{product.price}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [content, setContent] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    // Fallback data
    const defaultSlides = [
        { id: 1, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=270&fit=crop', title: 'Big Sale' },
        { id: 2, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=270&fit=crop', title: 'Electronics' },
        { id: 3, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=270&fit=crop', title: 'Fashion' },
        { id: 4, image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&h=270&fit=crop', title: 'Home' }
    ];

    const activeSlides = content?.heroSlides?.length > 0 ? content.heroSlides : defaultSlides;

    const categories = [
        { name: 'Electronics', img: 'https://rukminim1.flixcart.com/flap/80/80/image/69c6589653afdb9a.png?q=100' },
        { name: 'Fashion', img: 'https://rukminim1.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png?q=100' },
        { name: 'Footwear', img: 'https://cdn-icons-png.flaticon.com/128/2589/2589903.png' },
        { name: 'Beauty & Personal Care', img: 'https://rukminim1.flixcart.com/flap/80/80/image/dff3f7adcf3a90c6.png?q=100' },
        { name: 'Home & Appliances', img: 'https://rukminim1.flixcart.com/flap/80/80/image/ab7e2b022a4587dd.jpg?q=100' },
        { name: 'Sports & Fitness', img: 'https://cdn-icons-png.flaticon.com/128/2964/2964514.png' },
        { name: 'Toys & Baby', img: 'https://cdn-icons-png.flaticon.com/128/3081/3081329.png' },
        { name: 'Books', img: 'https://cdn-icons-png.flaticon.com/128/2232/2232688.png' },
        { name: 'Grocery', img: 'https://rukminim1.flixcart.com/flap/80/80/image/29327f40e9c4d26b.png?q=100' },
        { name: 'Accessories', img: 'https://cdn-icons-png.flaticon.com/128/2919/2919722.png' },
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, contentRes] = await Promise.all([
                    axios.get('/api/products'),
                    axios.get('/api/content')
                ]);

                setProducts(productsRes.data.products);
                setContent(contentRes.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
        }, 3000);

        // Show popup after 5 seconds
        const popupTimer = setTimeout(() => {
            const hasSeenPopup = sessionStorage.getItem('hasSeenPopup');
            if (!hasSeenPopup) {
                setShowPopup(true);
            }
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(popupTimer);
        };
    }, [activeSlides.length]);

    const closePopup = () => {
        setShowPopup(false);
        sessionStorage.setItem('hasSeenPopup', 'true');
    };

    if (loading) return <HomeSkeleton />;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    const testimonials = [
        { name: "Rahul S.", text: "Amazing quality and fast delivery! Will definitely buy again.", rating: 5 },
        { name: "Priya V.", text: "The deals are unbeatable. Ordered a phone and got it the next day.", rating: 5 },
        { name: "Amit K.", text: "Customer service is top notch. They helped me with a return within minutes.", rating: 4 },
    ];

    return (
        <div className="bg-[#f1f2f4] min-h-screen pb-8 relative">
            {/* Email Subscription Pop-up */}
            {showPopup && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col md:flex-row">
                        <button onClick={closePopup} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 z-10 bg-white rounded-full p-1"><X size={20} /></button>
                        <div className="md:w-2/5 bg-gradient-to-br from-primary to-blue-600 p-6 flex flex-col items-center justify-center text-white text-center">
                            <Gift size={48} className="mb-4 text-yellow-300 animate-bounce" />
                            <h3 className="text-2xl font-black mb-1">WAIT!</h3>
                            <p className="text-sm font-medium">Don't leave empty-handed</p>
                        </div>
                        <div className="md:w-3/5 p-8 text-center bg-white flex flex-col justify-center">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Get 10% Extra Off!</h3>
                            <p className="text-sm text-gray-500 mb-6">Enter your email below to unlock your exclusive first-time buyer discount.</p>
                            <div className="relative mb-4">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" placeholder="Email Address" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" />
                            </div>
                            <button onClick={closePopup} className="w-full bg-[#fb641b] hover:bg-[#e85d19] text-white font-bold py-2.5 rounded shadow transition uppercase tracking-wide text-sm mb-3">Claim My 10% Off</button>
                            <button onClick={closePopup} className="text-xs text-gray-400 hover:text-gray-600 underline">No thanks, I prefer paying full price</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Categories Section */}
            <div className="bg-white shadow-sm mb-3 overflow-x-auto no-scrollbar">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between md:justify-center min-w-max gap-4 md:gap-12">
                        {categories.map((cat, index) => (
                            <Link key={index} to={`/search/${cat.name}`} className="flex flex-col items-center group cursor-pointer gap-1">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden hover:scale-105 transition duration-300">
                                    <img src={cat.img} alt={cat.name} className="w-full h-full object-contain" />
                                </div>
                                <span className="text-[10px] md:text-xs font-bold text-gray-800 group-hover:text-primary transition">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hero Slider - Full Width */}
            <div className="mb-3 px-2">
                <div className="relative w-full h-[150px] sm:h-[200px] md:h-[280px] overflow-hidden shadow-sm group">
                    <div
                        className="flex transition-transform duration-500 ease-out h-full"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {activeSlides.map((slide, index) => (
                            <Link to={slide.url || '#'} key={index} className="min-w-full h-full relative cursor-pointer block">
                                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover md:object-fill" />
                            </Link>
                        ))}
                    </div>

                    <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/40 h-24 w-8 flex items-center justify-center rounded-r hover:bg-white transition hidden group-hover:flex">
                        <ChevronLeft size={24} className="text-gray-800" />
                    </button>
                    <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/40 h-24 w-8 flex items-center justify-center rounded-l hover:bg-white transition hidden group-hover:flex">
                        <ChevronRight size={24} className="text-gray-800" />
                    </button>
                </div>
            </div>

            {/* Bank Offer Strip (Mock) */}
            {/*  <div className="container mx-auto px-2 mb-3">
                <img src="https://rukminim1.flixcart.com/fk-p-flap/1600/140/image/12e43130c25d8866.jpg?q=20" alt="Bank Offer" className="w-full rounded-sm shadow-sm" />
            </div> */}

            {/* Special "Deals of the Day" Section with Background */}
            <div className="container mx-auto px-2 md:px-3 mb-4">
                <div className="flex relative bg-white shadow-sm border border-gray-200 rounded-sm overflow-hidden h-full md:h-[300px]">
                    {/* Left Banner Info */}
                    <div className="hidden md:flex flex-col justify-center items-center w-1/5 bg-[url('https://rukminim1.flixcart.com/fk-p-flap/278/278/image/7593e7b664cdff75.jpg?q=90')] bg-cover bg-bottom text-white p-4 text-center relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <h2 className="text-3xl font-bold mb-4 relative z-10 drop-shadow-md">{content?.dealOfTheDay?.title || 'Deals of the Day'}</h2>
                        <div className="flex items-center gap-2 mb-6 relative z-10">
                            <Clock size={20} />
                            <span className="font-bold text-lg">14 : 25 : 11</span>
                        </div>
                        <Link to="/products" className="bg-[#2874f0] text-white px-4 py-2 rounded-sm font-bold shadow-lg hover:shadow-xl transition text-sm relative z-10">VIEW ALL</Link>
                    </div>

                    {/* Mobile Title Strip */}
                    <div className="md:hidden flex items-center justify-between p-3 border-b border-gray-100 w-full absolute top-0 left-0 bg-white z-10">
                        <h2 className="text-lg font-bold text-gray-800">{content?.dealOfTheDay?.title || 'Deals of the Day'}</h2>
                        <Link to="/products" className="bg-primary text-white px-3 py-1 rounded-sm text-xs font-bold">View All</Link>
                    </div>

                    {/* Products Slider/Grid */}
                    <div className="w-full md:w-4/5 p-4 md:p-6 flex items-center gap-4 overflow-x-auto no-scrollbar pt-12 md:pt-6">
                        {products && products.slice && products.slice(0, 5).map((product) => (
                            <Link to={`/product/${product._id}`} key={product._id} className="min-w-[150px] md:min-w-[180px] flex flex-col items-center gap-2 group cursor-pointer p-2 hover:bg-gray-50 rounded transition">
                                <div className="w-32 h-32 md:w-40 md:h-40 relative mb-2">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition duration-300" />
                                </div>
                                <span className="text-xs md:text-sm font-medium text-gray-700 text-center line-clamp-2 md:line-clamp-1">{product.name}</span>
                                <span className="text-green-600 font-bold text-sm">
                                    {(product.originalPrice && product.originalPrice > product.price)
                                        ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off`
                                        : `20-50% Off`}
                                </span>
                                <span className="text-gray-500 text-xs">{product.category}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section 1: Best of Electronics */}
            <ProductSection
                title="Best of Electronics"
                items={products ? products.filter(p => p.category === 'Electronics') : []}
            />



            {/* Section 2: Beauty, Food, Toys & More */}
            <ProductSection
                title="Beauty, Food, Toys & More"
                items={products ? products.filter(p => ['Beauty & Personal Care', 'Grocery', 'Toys & Baby'].includes(p.category)) : []}
            />

            {/* Featured Brand Full Width Banner */}
            {/* <div className="px-2 mb-4">
                 <img src="https://rukminim1.flixcart.com/fk-p-flap/1600/270/image/aa1b2376824579d4.jpg?q=20" className="w-full shadow-sm" alt="Featured" />
            </div> */}

            {/* Recommended Grid */}
            <div className="container mx-auto px-2 md:px-3">
                <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-200">
                    <div className="border-b pb-3 mb-4">
                        <h2 className="text-lg md:text-xl font-medium text-gray-800">Suggested for You</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4">
                        {products.map((product) => (
                            <div key={product._id} className="border border-gray-100 rounded-sm p-4 hover:shadow-lg transition flex flex-col group relative overflow-hidden bg-white">
                                <button className="absolute top-2 right-2 text-gray-300 hover:text-red-500 z-10">
                                    <Heart size={16} />
                                </button>

                                <Link to={`/product/${product?._id}`} className="block relative h-40 mb-2 p-2">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-contain group-hover:scale-105 transition duration-500"
                                    />
                                </Link>
                                <div className="mt-auto">
                                    <h3 className="text-xs font-medium text-gray-500 mb-1 truncate">{product.brand || 'Brand'}</h3>
                                    <Link to={`/product/${product?._id}`}>
                                        <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1 hover:text-primary transition" title={product?.name}>
                                            {product?.name}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                            {product?.rating || 4.2} <Star size={8} fill="white" />
                                        </div>
                                        <span className="text-gray-400 text-xs text-[10px]">({product?.numReviews || 124})</span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-base font-bold">₹{product?.price}</span>
                                        {(product?.originalPrice && product.originalPrice > product.price) ? (
                                            <>
                                                <span className="text-gray-400 text-xs line-through">₹{product.originalPrice}</span>
                                                <span className="text-green-700 text-[10px] font-bold">{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-gray-400 text-xs line-through">₹{Math.round(product?.price * 1.2)}</span>
                                                <span className="text-green-700 text-[10px] font-bold">20% off</span>
                                            </>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-medium hidden group-hover:block transition">Free delivery</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials / Social Proof Section */}
            <div className="container mx-auto px-2 md:px-3 mt-8">
                <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-center text-gray-800 mb-6">What Our Customers Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="bg-gray-50 p-5 rounded-md border border-gray-100 flex flex-col items-center text-center">
                                <div className="flex gap-1 text-yellow-400 mb-3">
                                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <p className="text-sm text-gray-600 italic mb-4">"{t.text}"</p>
                                <span className="font-bold text-gray-800 text-sm">- {t.name}</span>
                                <div className="flex items-center gap-1 mt-1 text-green-600 text-[10px] font-bold">
                                    <Check size={12} /> Verified Buyer
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Policy Strip */}
            <div className="bg-gray-100 mt-8 py-8 border-t border-gray-200">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-gray-500 text-sm">
                    <div className='flex flex-col items-center gap-2'>
                        <div className="bg-white p-3 rounded-full shadow-sm"><Tag size={24} className="text-gray-600" /></div>
                        <div><span className="font-bold text-gray-700">100% Secure Payments</span><br />All major credit & debit cards accepted</div>
                    </div>
                    <div className='flex flex-col items-center gap-2'>
                        <div className="bg-white p-3 rounded-full shadow-sm"><Gift size={24} className="text-gray-600" /></div>
                        <div><span className="font-bold text-gray-700">TrustPay</span><br />100% Payment Protection. Easy Return Policy</div>
                    </div>
                    <div className='flex flex-col items-center gap-2'>
                        <div className="bg-white p-3 rounded-full shadow-sm"><Clock size={24} className="text-gray-600" /></div>
                        <div><span className="font-bold text-gray-700">Help Center</span><br />Got a question? Look no further.</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;

