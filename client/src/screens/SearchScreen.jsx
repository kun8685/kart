import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Heart } from 'lucide-react';
import Loader from '../components/Loader';
import Message from '../components/Message';

const SearchScreen = () => {
    const { keyword } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // The backend now filters by name, brand, OR category using the keyword
                const { data } = await axios.get(`/api/products?keyword=${keyword}`);
                setProducts(data.products);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword]);

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Search Results for "{keyword}"
            </h1>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    {products.length === 0 ? (
                        <Message>No products found for your search.</Message>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {products.map((product) => (
                                <div key={product._id} className="bg-white border border-gray-100 rounded-sm p-4 hover:shadow-lg transition flex flex-col group relative overflow-hidden">
                                    <button className="absolute top-2 right-2 text-gray-300 hover:text-red-500 z-10">
                                        <Heart size={16} />
                                    </button>

                                    <Link to={`/product/${product._id}`} className="block relative h-48 mb-4 p-2">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                                        />
                                    </Link>

                                    <div className="mt-auto">
                                        <h3 className="text-xs font-medium text-gray-500 mb-1 truncate">{product.brand || 'Brand'}</h3>
                                        <Link to={`/product/${product._id}`}>
                                            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 hover:text-primary transition" title={product.name}>
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                                {product.rating || 4.2} <Star size={8} fill="white" />
                                            </div>
                                            <span className="text-gray-400 text-xs text-[10px]">({product.numReviews || 0})</span>
                                        </div>

                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-base font-bold">₹{product.price}</span>
                                            {/* Mock original price for discount display */}
                                            <span className="text-gray-400 text-xs line-through">₹{Math.round(product.price * 1.2)}</span>
                                            <span className="text-green-700 text-[10px] font-bold">20% off</span>
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-medium hidden group-hover:block transition mt-1">Free delivery</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Explore More Categories Section */}
            {!loading && (
                <div className="mt-16 border-t border-gray-200 pt-10">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Explore More Departments</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[
                            { name: 'Electronics', img: 'https://rukminim1.flixcart.com/flap/80/80/image/69c6589653afdb9a.png?q=100' },
                            { name: 'Fashion', img: 'https://rukminim1.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png?q=100' },
                            { name: 'Footwear', img: 'https://rukminim1.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png?q=100' },
                            { name: 'Beauty & Personal Care', img: 'https://rukminim1.flixcart.com/flap/80/80/image/dff3f7adcf3a90c6.png?q=100' },
                            { name: 'Home & Appliances', img: 'https://rukminim1.flixcart.com/flap/80/80/image/0ff199d1bd27eb98.png?q=100' },
                            { name: 'Sports & Fitness', img: 'https://rukminim1.flixcart.com/flap/80/80/image/71050627a56cb900.png?q=100' },
                            { name: 'Toys & Baby', img: 'https://rukminim1.flixcart.com/flap/80/80/image/dff3f7adcf3a90c6.png?q=100' },
                            { name: 'Books', img: 'https://rukminim1.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png?q=100' },
                            { name: 'Grocery', img: 'https://rukminim1.flixcart.com/flap/80/80/image/ab7e2b022a4587dd.jpg?q=100' },
                            { name: 'Accessories', img: 'https://rukminim1.flixcart.com/fk-p-flap/80/80/image/0d75b34f7d8fbcb3.png?q=100' },
                        ]
                            .filter(cat => cat.name.toLowerCase() !== keyword?.toLowerCase())
                            .slice(0, 5) // Show top 5 suggestions
                            .map((cat, index) => (
                                <Link
                                    key={index}
                                    to={`/search/${cat.name}`}
                                    className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-white hover:shadow-md transition border border-transparent hover:border-gray-100 group"
                                >
                                    <div className="w-16 h-16 mb-3 rounded-full bg-white p-2 shadow-sm group-hover:scale-110 transition-transform">
                                        <img src={cat.img} alt={cat.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 text-center">{cat.name}</span>
                                    <span className="text-xs text-primary font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">View Products</span>
                                </Link>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchScreen;
