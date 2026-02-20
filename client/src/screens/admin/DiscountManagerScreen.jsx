import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Percent, XCircle, CheckCircle, Tag, ShoppingCart, Loader2 } from 'lucide-react';

const DiscountManagerScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);

    const [type, setType] = useState('all'); // 'all', 'category', 'product'
    const [target, setTarget] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [selectedProductCategory, setSelectedProductCategory] = useState('');
    const [fetchedProducts, setFetchedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const categories = [
        'Electronics', 'Fashion', 'Footwear', 'Beauty & Personal Care',
        'Home & Appliances', 'Sports & Fitness', 'Toys & Baby', 'Books',
        'Grocery', 'Accessories'
    ];

    const handleProductCategoryChange = async (category) => {
        setSelectedProductCategory(category);
        setTarget('');
        if (!category) {
            setFetchedProducts([]);
            return;
        }

        try {
            const { data } = await axios.get(`/api/products?pageSize=1000&category=${category}`);
            setFetchedProducts(data.products || []);
        } catch (err) {
            console.error('Failed to fetch products', err);
        }
    };

    const applyDiscountHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post('/api/products/apply-discount', {
                type,
                target,
                discountPercentage: Number(discountPercentage)
            }, config);

            setMessage(data.message);
            setLoading(false);
            setDiscountPercentage('');
            setTarget('');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    const removeDiscountHandler = async () => {
        if (!window.confirm('Are you sure you want to revert prices to their original MRP?')) return;

        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post('/api/products/remove-discount', {
                type,
                target
            }, config);

            setMessage(data.message);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <Percent className="text-primary" /> Mass Discount Manager
            </h1>

            {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2"><CheckCircle size={20} /> {message}</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2"><XCircle size={20} /> {error}</div>}

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Apply New Sale / Discount</h2>

                <form onSubmit={applyDiscountHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Discount Target</label>
                        <select
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                setTarget('');
                                setSelectedProductCategory('');
                                setFetchedProducts([]);
                            }}
                            className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">Entire Website (All Products)</option>
                            <option value="category">Specific Category</option>
                            <option value="product">Specific Product (by ID)</option>
                        </select>
                    </div>

                    {type === 'category' && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Select Category</label>
                            <select
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                required
                                className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">-- Choose Category --</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    )}

                    {type === 'product' && (
                        <div className="mb-4 flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-gray-700 text-sm font-bold mb-2">1. Filter by Category</label>
                                <select
                                    value={selectedProductCategory}
                                    onChange={(e) => handleProductCategoryChange(e.target.value)}
                                    required
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="">-- Choose Category --</option>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="flex-1">
                                <label className="block text-gray-700 text-sm font-bold mb-2">2. Select Product</label>
                                <select
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    required
                                    disabled={!selectedProductCategory || fetchedProducts.length === 0}
                                    className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    <option value="">-- Choose Specific Product --</option>
                                    {fetchedProducts.map(p => (
                                        <option key={p._id} value={p._id}>{p.name} (MRP: ₹{p.originalPrice || p.price})</option>
                                    ))}
                                </select>
                                {selectedProductCategory && fetchedProducts.length === 0 && (
                                    <p className="text-xs text-red-500 mt-1">No products found in this category.</p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Discount Percentage (%)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={discountPercentage}
                                onChange={(e) => setDiscountPercentage(e.target.value)}
                                required
                                min="1"
                                max="99"
                                placeholder="e.g. 50"
                                className="shadow-sm appearance-none border rounded w-full py-2 px-3 pl-8 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Example: Entering 99 will make a ₹100 product cost ₹1.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={loading || (type !== 'all' && !target)}
                            className="bg-primary text-white font-bold py-2 px-6 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-50 flex items-center gap-2 transition-colors"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Tag size={18} />} Apply Discount
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone: Remove Discounts */}
            <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <h2 className="text-lg font-bold text-red-800 mb-2 border-b border-red-200 pb-2 flex items-center gap-2">
                    <XCircle size={20} /> Revert Sale / Reset Prices
                </h2>
                <p className="text-sm text-red-600 mb-4">
                    This will remove the applied discount and restore the product prices back to their original MRP.
                    It will only apply to the target selected above (<b>{type === 'all' ? 'Entire Website' : type === 'category' ? `Category: ${target || 'None'}` : `Product: ${target || 'None'}`}</b>).
                </p>
                <button
                    onClick={removeDiscountHandler}
                    disabled={loading || (type !== 'all' && !target)}
                    className="bg-red-600 text-white font-bold py-2 px-6 rounded shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Processing...' : 'Remove Sale Prices'}
                </button>
            </div>
        </div>
    );
};

export default DiscountManagerScreen;
