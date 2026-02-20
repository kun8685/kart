import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ProductEditScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [originalPrice, setOriginalPrice] = useState(0);
    const [image, setImage] = useState('');
    const [images, setImages] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [shippingPrice, setShippingPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [sizes, setSizes] = useState('');
    const [colors, setColors] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }

        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setName(data.name);
                setPrice(data.price);
                setOriginalPrice(data.originalPrice || 0);
                setImage(data.image);
                setImages(data.images ? data.images.join(', ') : '');
                setBrand(data.brand);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setShippingPrice(data.shippingPrice || 0);
                setDescription(data.description);
                setSizes(data.sizes ? data.sizes.join(', ') : '');
                setColors(data.colors ? data.colors.join(', ') : '');
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.put(
                `/api/products/${id}`,
                {
                    name,
                    price,
                    originalPrice,
                    image,
                    images: images ? images.split(',').map(s => s.trim()).filter(s => s) : [],
                    brand,
                    category,
                    countInStock,
                    shippingPrice,
                    description,
                    sizes: sizes ? sizes.split(',').map(s => s.trim()).filter(s => s) : [],
                    colors: colors ? colors.split(',').map(c => c.trim()).filter(c => c) : [],
                },
                config
            );
            navigate('/admin/productlist');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <Link to="/admin/productlist" className="flex items-center text-gray-500 hover:text-primary mb-6">
                <ArrowLeft size={18} className="mr-1" /> Go Back
            </Link>

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 uppercase tracking-wide">Edit Product</h1>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Original Price (MRP)</label>
                            <input
                                type="number"
                                placeholder="Enter original price"
                                value={originalPrice}
                                onChange={(e) => setOriginalPrice(e.target.value)}
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Selling Price</label>
                            <input
                                type="number"
                                placeholder="Enter selling price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Shipping Charge (₹)</label>
                            <input
                                type="number"
                                placeholder="Enter shipping fee (0 for free)"
                                value={shippingPrice}
                                onChange={(e) => setShippingPrice(e.target.value)}
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Main Image URL</label>
                        <input
                            type="text"
                            placeholder="Enter main image url"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary mb-2"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Additional Image URLs (Comma Separated)</label>
                        <textarea
                            placeholder="https://image1.jpg, https://image2.jpg"
                            value={images}
                            onChange={(e) => setImages(e.target.value)}
                            rows="2"
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary mb-2"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Brand</label>
                        <input
                            type="text"
                            placeholder="Enter brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Count In Stock</label>
                        <input
                            type="number"
                            placeholder="Enter stock"
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                        >
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Footwear">Footwear</option>
                            <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                            <option value="Home & Appliances">Home & Appliances</option>
                            <option value="Sports & Fitness">Sports & Fitness</option>
                            <option value="Toys & Baby">Toys & Baby</option>
                            <option value="Books">Books</option>
                            <option value="Grocery">Grocery</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Sizes (comma separated)</label>
                            <input
                                type="text"
                                placeholder="e.g. S, M, L, XL"
                                value={sizes}
                                onChange={(e) => setSizes(e.target.value)}
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Colors (comma separated)</label>
                            <input
                                type="text"
                                placeholder="e.g. Red, Blue, Black"
                                value={colors}
                                onChange={(e) => setColors(e.target.value)}
                                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-4 rounded hover:bg-blue-600 transition"
                    >
                        <Save size={18} /> Update Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductEditScreen;
