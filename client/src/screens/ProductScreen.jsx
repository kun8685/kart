import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { Star, Truck, ShieldCheck, Heart, Share2, Tag, ChevronRight, ShoppingCart, Zap } from 'lucide-react';
import axios from 'axios';

const ProductScreen = () => {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [qty, setQty] = useState(1);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);

                // Using 'variants' as per data/products.js
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariation(data.variants[0]);
                } else {
                    // Fallback for non-variant products
                    setSelectedVariation({
                        size: 'Standard', // or weight, depending on context
                        price: data.price,
                        stock: data.countInStock
                    });
                }
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
            price: selectedVariation ? (selectedVariation.priceOverride || selectedVariation.price) : product.price,
            weight: selectedVariation ? selectedVariation.size : null,
            countInStock: selectedVariation ? selectedVariation.stock : product.countInStock,
            shippingPrice: product.shippingPrice || 0,
            qty
        }));
        navigate('/cart');
    };

    const currentPrice = selectedVariation ? (selectedVariation.priceOverride || selectedVariation.price) : product.price;

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
                    {/* Left Column: Images (40% width on desktop) */}
                    <div className="lg:col-span-2 relative">
                        <div className="sticky top-20 border border-gray-100 rounded-sm p-4 flex justify-center items-center bg-white min-h-[300px] md:min-h-[400px]">
                            <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
                                <button className="p-2 rounded-full shadow-md bg-white text-gray-400 hover:text-red-500 transition">
                                    <Heart size={20} />
                                </button>
                                <button className="p-2 rounded-full shadow-md bg-white text-gray-400 hover:text-blue-500 transition">
                                    <Share2 size={20} />
                                </button>
                            </div>
                            <img
                                src={product.image}
                                alt={product.name}
                                className="max-w-full max-h-[400px] object-contain hover:scale-105 transition duration-500"
                            />
                        </div>

                        {/* Action Buttons (Desktop) */}
                        <div className="hidden md:flex gap-4 mt-6">
                            <button
                                onClick={addToCartHandler}
                                disabled={selectedVariation?.stock === 0}
                                className="flex-1 bg-[#ff9f00] hover:bg-[#f39400] text-white font-bold py-3.5 rounded-sm shadow-sm transition uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <ShoppingCart size={20} /> {selectedVariation?.stock === 0 ? 'Notify Me' : 'Add to Cart'}
                            </button>
                            <button
                                onClick={addToCartHandler} // Should be Buy Now logic
                                disabled={selectedVariation?.stock === 0}
                                className="flex-1 bg-[#fb641b] hover:bg-[#e85d19] text-white font-bold py-3.5 rounded-sm shadow-sm transition uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Zap size={20} fill="currentColor" /> Buy Now
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Details (60% width on desktop) */}
                    <div className="lg:col-span-3 mt-6 md:mt-0">
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
                            <span className="text-3xl font-bold text-gray-900">₹{currentPrice}</span>
                            <span className="text-gray-500 line-through text-base">₹{Math.round(currentPrice * 1.25)}</span>
                            <span className="text-green-700 font-bold text-sm">20% off</span>
                        </div>

                        {/* Bank Offers Placeholder */}
                        <div className="mb-6 space-y-2">
                            <p className="font-bold text-sm text-gray-800 mb-1">Available offers</p>
                            <div className="flex items-start gap-2 text-sm text-gray-700">
                                <Tag size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                <span><span className="font-bold">Bank Offer</span> 5% Unlimited Cashback on Axis Bank Credit Card <span className="text-blue-600 font-semibold cursor-pointer">T&C</span></span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-700">
                                <Tag size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                <span><span className="font-bold">Bank Offer</span> 10% Off on Bank of Baroda Mastercard debit card first time transaction <span className="text-blue-600 font-semibold cursor-pointer">T&C</span></span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-700">
                                <Tag size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                <span><span className="font-bold">Partner Offer</span> Sign up for Pay Later and get Gift Card worth up to ₹500* <span className="text-blue-600 font-semibold cursor-pointer">Know More</span></span>
                            </div>
                        </div>

                        {/* Variation Selector with improved logic for variants property */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-6 flex gap-4 items-start">
                                <span className="text-gray-500 font-medium w-24 pt-1">Size/Weight</span>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((variant, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedVariation(variant)}
                                            className={`px-3 py-1.5 border rounded-sm text-sm font-bold transition ${selectedVariation && selectedVariation.size === variant.size
                                                ? 'border-primary text-primary bg-blue-50'
                                                : 'border-gray-300 text-gray-700 hover:border-primary'
                                                } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
                                            disabled={variant.stock === 0}
                                        >
                                            {variant.size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Feature Points */}
                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Truck size={18} className="text-primary" />
                                <span>Free Delivery</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <ShieldCheck size={18} className="text-primary" />
                                <span>1 Year Warranty</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="border border-gray-200 rounded-sm">
                            <div className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-800">Product Description</div>
                            <div className="p-4 text-sm text-gray-600 leading-relaxed">
                                {product.description}
                            </div>
                        </div>

                        {/* Ratings & Reviews Short */}
                        <div className="mt-8 border p-4 rounded-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Ratings & Reviews</h3>
                                <button className="bg-white shadow text-sm px-4 py-2 border rounded-sm">Rate Product</button>
                            </div>
                            <div className="flex items-center gap-8 mb-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-1">
                                        {product.rating || 4.2} <Star size={24} fill="black" className="text-yellow-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{product.numReviews} Ratings</p>
                                </div>
                                <div className="border-l pl-8 flex-1">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span>5 <Star size={8} className="inline" /></span>
                                            <div className="h-1 bg-green-500 w-3/4 rounded-full"></div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span>4 <Star size={8} className="inline" /></span>
                                            <div className="h-1 bg-green-400 w-1/2 rounded-full"></div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span>3 <Star size={8} className="inline" /></span>
                                            <div className="h-1 bg-green-200 w-1/4 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer Actions */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex z-50">
                <button
                    onClick={addToCartHandler}
                    disabled={selectedVariation?.stock === 0}
                    className="flex-1 bg-white text-gray-800 font-bold py-4 text-sm uppercase tracking-wide disabled:opacity-50"
                >
                    Add to Cart
                </button>
                <button
                    onClick={addToCartHandler}
                    disabled={selectedVariation?.stock === 0}
                    className="flex-1 bg-yellow-400 text-gray-900 font-bold py-4 text-sm uppercase tracking-wide disabled:opacity-50"
                >
                    Buy Now
                </button>
            </div>
            {/* Spacer for sticky footer */}
            <div className="h-16 md:hidden"></div>
        </div>
    );
};

export default ProductScreen;

