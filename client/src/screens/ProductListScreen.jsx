import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ProductListScreen = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products?pageNumber=1'); // Fetch all products logic needs adjustment for no pagination or large limit
            setProducts(data.products);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            fetchProducts();
        } else {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await axios.delete(`/api/products/${id}`, config);
                fetchProducts(); // Refresh list
            } catch (error) {
                alert(error.response?.data?.message || error.message);
            }
        }
    };

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.post('/api/products', {}, config);
                navigate(`/admin/product/${data._id}/edit`);
            } catch (error) {
                alert(error.response?.data?.message || error.message);
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Products (Inventory)</h1>
                <button
                    onClick={createProductHandler}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                >
                    <Plus size={18} /> Create Product
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
                        <tr>
                            <th className="p-4 border-b">ID</th>
                            <th className="p-4 border-b">Name</th>
                            <th className="p-4 border-b">Price</th>
                            <th className="p-4 border-b">Category</th>
                            <th className="p-4 border-b">Brand</th>
                            <th className="p-4 border-b">Stock</th>
                            <th className="p-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-500">{product._id}</td>
                                <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                <td className="p-4 text-gray-700">₹{product.price}</td>
                                <td className="p-4 text-gray-600">{product.category}</td>
                                <td className="p-4 text-gray-600">{product.brand}</td>
                                <td className="p-4">
                                    {product.countInStock === 0 ? (
                                        <span className="bg-red-100 text-red-600 py-1 px-2 rounded-full text-xs font-bold">Out of Stock</span>
                                    ) : product.countInStock <= 5 ? (
                                        <span className="bg-orange-100 text-orange-600 py-1 px-2 rounded-full text-xs font-bold">Low: {product.countInStock}</span>
                                    ) : (
                                        <span className="text-gray-700">{product.countInStock}</span>
                                    )}
                                </td>
                                <td className="p-4 flex items-center gap-3">
                                    <Link to={`/admin/product/${product._id}/edit`} className="text-blue-500 hover:text-blue-700">
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => deleteHandler(product._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListScreen;
