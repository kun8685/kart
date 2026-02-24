import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { Star, Truck, ShieldCheck, Heart, Share2, Tag, ChevronRight, ShoppingCart, Zap, Check, MapPin } from 'lucide-react';
import axios from 'axios';

const ProductScreen = () => {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty] = useState(1);
    const [mainImage, setMainImage] = useState('');

    // New state for selections
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);

                // Initialize selections if available
                if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
                if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);

                // Initialize Main Image
                setMainImage(data.image);

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (!product) return <div className="text-center py-10">Product not found</div>;

    const addToCartHandler = () => {
        dispatch(addToCart({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice || 0,
            countInStock: product.countInStock,
            shippingPrice: product.shippingPrice || 0,
            size: selectedSize,
            color: selectedColor,
            qty
        }));
        navigate('/cart');
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-4">
                {/* Breadcrumbs */}
                <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                    <Link to="/" className="hover:text-primary">Home</Link> <ChevronRight size={12} />
                    <Link to="/products" className="hover:text-primary">Products</Link> <ChevronRight size={12} />
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 md:gap-8">
                    {/* Left Column: Images & Buttons */}
                    <div className="lg:col-span-2 flex flex-col">
                        <div className="relative flex flex-col md:flex-row gap-4">

                            {/* Thumbnails Gallery (Desktop: Left, Mobile: Bottom/Hidden) */}
                            {product.images && product.images.length > 0 && (
                                <div className="hidden md:flex flex-col gap-2 w-16 md:w-20 overflow-y-auto max-h-[400px] no-scrollbar">
                                    {/* Primary Image Thumbnail */}
                                    <div
                                        className={`cursor-pointer border-2 rounded p-1 mb-1 transition-all ${mainImage === product.image ? 'border-primary' : 'border-gray-200 hover:border-gray-300'}`}
                                        onMouseEnter={() => setMainImage(product.image)}
                                        onClick={() => setMainImage(product.image)}
                                    >
                                        <img src={product.image} alt="Thumbnail Primary" className="w-full h-12 object-contain" />
                                    </div>
                                    {/* Additional Images Thumbnails */}
                                    {product.images.map((imgUrl, index) => (
                                        <div
                                            key={index}
                                            className={`cursor-pointer border-2 rounded p-1 transition-all ${mainImage === imgUrl ? 'border-primary' : 'border-gray-200 hover:border-gray-300'}`}
                                            onMouseEnter={() => setMainImage(imgUrl)}
                                            onClick={() => setMainImage(imgUrl)}
                                        >
                                            <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-12 object-contain" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex-1 sticky top-20 border border-gray-100 rounded-sm p-4 flex justify-center items-center bg-white min-h-[300px] md:min-h-[400px]">
                                <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
                                    <button className="p-2 rounded-full shadow-md bg-white text-gray-400 hover:text-red-500 transition">
                                        <Heart size={20} />
                                    </button>
                                    <button className="p-2 rounded-full shadow-md bg-white text-gray-400 hover:text-blue-500 transition">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="max-w-full max-h-[400px] object-contain hover:scale-105 transition duration-500"
                                />
                            </div>
                        </div>

                        {/* Action Buttons (Desktop) */}
                        <div className="hidden md:flex gap-4 mt-4 w-full justify-center lg:justify-start pl-[5rem] lg:pl-[6rem]">
                            <button
                                onClick={addToCartHandler}
                                disabled={product.countInStock === 0}
                                className="flex-1 bg-[#ff9f00] hover:bg-[#f39400] text-white font-bold py-3.5 rounded-sm shadow-sm transition uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <ShoppingCart size={20} /> {product.countInStock === 0 ? 'Notify Me' : 'Add to Cart'}
                            </button>
                            <button
                                onClick={addToCartHandler}
                                disabled={product.countInStock === 0}
                                className="flex-1 bg-[#fb641b] hover:bg-[#e85d19] text-white font-bold py-3.5 rounded-sm shadow-sm transition uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Zap size={20} fill="currentColor" /> Buy Now
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-3 mt-6 lg:mt-0">
                        <h1 className="text-lg md:text-2xl font-medium text-gray-800 mb-2">{product.name}</h1>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-700 text-white text-xs font-bold px-2 py-1 rounded-sm flex items-center gap-1 cursor-pointer">
                                {product.rating || 4.2} <Star size={10} fill="white" />
                            </div>
                            <span className="text-gray-500 text-sm font-medium">{product.numReviews} Ratings & {product.reviews?.length || 0} Reviews</span>
                            <div className="flex items-center gap-1 text-gray-400 text-xs font-semibold ml-2 border border-gray-200 px-1 py-0.5 rounded bg-gray-50">
                                <ShieldCheck size={12} className="text-primary" /> Assured
                            </div>
                        </div>

                        <p className="text-green-700 font-bold text-sm mb-1">Special Price</p>
                        <div className="flex items-end gap-3 mb-4">
                            <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                            {(product.originalPrice && product.originalPrice > product.price) ? (
                                <>
                                    <span className="text-gray-500 line-through text-base">₹{product.originalPrice}</span>
                                    <span className="text-green-700 font-bold text-sm">{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-gray-500 line-through text-base">₹{Math.round(product.price * 1.25)}</span>
                                    <span className="text-green-700 font-bold text-sm">20% off</span>
                                </>
                            )}
                        </div>

                        {/* FOMO Stock Warning */}
                        {product.countInStock > 0 && product.countInStock <= 10 && (
                            <div className="mb-4 text-red-500 font-bold text-sm flex items-center gap-1 bg-red-50 w-fit px-3 py-1.5 rounded border border-red-100 animate-pulse">
                                Hurry! Only {product.countInStock} left in stock.
                            </div>
                        )}
                        {product.countInStock === 0 && (
                            <div className="mb-4 text-red-500 font-bold text-sm flex items-center gap-1 bg-red-50 w-fit px-3 py-1.5 rounded border border-red-100">
                                Currently Out of Stock!
                            </div>
                        )}

                        {/* Bank Offers */}
                        <div className="mb-6 space-y-2">
                            <p className="font-bold text-sm text-gray-800 mb-1">Available offers</p>
                            <div className="flex items-start gap-2 text-sm text-gray-700">
                                <Tag size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                <span><span className="font-bold">Bank Offer</span> 5% Unlimited Cashback on Axis Bank Credit Card <span className="text-blue-600 font-semibold cursor-pointer">T&C</span></span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-700">
                                <Tag size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                <span><span className="font-bold">Bank Offer</span> 10% Off on Bank of Baroda Mastercard debit card <span className="text-blue-600 font-semibold cursor-pointer">T&C</span></span>
                            </div>
                        </div>

                        {/* Size Selector */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2 max-w-sm">
                                    <span className="text-gray-500 font-medium text-sm">Select Size</span>
                                    <button className="text-primary font-bold text-xs uppercase">Size Chart</button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[3rem] px-2 py-2 border rounded-sm text-sm font-bold transition flex items-center justify-center relative ${selectedSize === size
                                                ? 'border-primary text-primary bg-blue-50'
                                                : 'border-gray-300 text-gray-700 hover:border-primary'
                                                }`}
                                        >
                                            {size}
                                            {selectedSize === size && (
                                                <div className="absolute top-0 right-0 -mt-1 -mr-1">
                                                    {/* Optional checkmark or badge */}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selector */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-6">
                                <span className="text-gray-500 font-medium text-sm mb-2 block">Select Color</span>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors.map((color, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-4 py-2 border rounded-sm text-sm font-bold transition flex items-center gap-2 ${selectedColor === color
                                                ? 'border-primary text-primary bg-blue-50 ring-1 ring-primary'
                                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                                }`}
                                        >
                                            {/* Color Dot */}
                                            <span
                                                className="w-4 h-4 rounded-full border border-gray-200"
                                                style={{ backgroundColor: color.toLowerCase() }}
                                            ></span>
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Delivery Pincode Checker */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-gray-800 font-bold text-sm mb-2">
                                <MapPin size={18} className="text-gray-500" /> Delivery Options
                            </div>
                            <div className="flex max-w-sm">
                                <input type="text" placeholder="Enter Delivery Pincode" className="border border-gray-300 border-r-0 rounded-l-sm px-3 py-2.5 outline-none w-full text-sm focus:border-primary" />
                                <button className="bg-primary text-white px-5 py-2.5 text-sm font-bold rounded-r-sm hover:bg-blue-700 transition">Check</button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Please enter PIN code to check delivery time & Pay on Delivery Availability</p>
                        </div>

                        {/* Feature Points */}
                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Truck size={18} className="text-primary" />
                                <span>Free Delivery by Tomorrow</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <ShieldCheck size={18} className="text-primary" />
                                <span>1 Year Warranty</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="border border-gray-200 rounded-sm mb-4">
                            <div className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-800">Product Description</div>
                            <div className="p-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {product.description}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Sticky Footer - Rendered via Portal directly on document.body
                     This bypasses any parent CSS (relative/overflow/transform) that breaks position:fixed */}
                {typeof document !== 'undefined' && createPortal(
                    <div style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        display: 'flex',
                        boxShadow: '0 -3px 12px rgba(0,0,0,0.15)',
                        fontFamily: 'inherit',
                    }} className="md:hidden">
                        <button
                            onClick={addToCartHandler}
                            disabled={product.countInStock === 0}
                            style={{
                                flex: 1,
                                background: '#ffffff',
                                color: '#000',
                                fontWeight: 700,
                                padding: '15px 0',
                                fontSize: '15px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                borderRight: '1px solid #e0e0e0',
                                borderTop: '1px solid #e8e8e8',
                                cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer',
                                opacity: product.countInStock === 0 ? 0.5 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            <ShoppingCart size={18} />
                            Add to Cart
                        </button>
                        <button
                            onClick={addToCartHandler}
                            disabled={product.countInStock === 0}
                            style={{
                                flex: 1,
                                background: '#fb9a00',
                                color: '#000',
                                fontWeight: 700,
                                padding: '15px 0',
                                fontSize: '15px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                cursor: product.countInStock === 0 ? 'not-allowed' : 'pointer',
                                opacity: product.countInStock === 0 ? 0.5 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            <Zap size={18} fill="currentColor" />
                            Buy Now
                        </button>
                    </div>,
                    document.body
                )}
                {/* Spacer so content isn't hidden behind sticky bar */}
                <div className="h-20 md:hidden"></div>
            </div>
        </div>
    );
};

export default ProductScreen;
