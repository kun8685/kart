import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tags, Plus, PlusCircle, Trash2, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactModal from "react-modal";

const CouponListScreen = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discountType: "Percentage",
        discountAmount: 0,
        maxDiscountAmount: 0,
        minOrderAmount: 0,
        expiryDate: ""
    });

    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate("/login");
        }
    }, [navigate, userInfo]);

    const fetchCoupons = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.get("/api/coupons", config);
            setCoupons(data);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to fetch coupons");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const createCouponHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.post("/api/coupons", newCoupon, config);
            setIsModalOpen(false);
            fetchCoupons();
            // reset
            setNewCoupon({
                code: "",
                discountType: "Percentage",
                discountAmount: 0,
                maxDiscountAmount: 0,
                minOrderAmount: 0,
                expiryDate: ""
            });
        } catch (error) {
            alert(error.response?.data?.message || "Error creating coupon");
        }
    };

    const toggleActiveHandler = async (id) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.patch(`/api/coupons/${id}/toggleActive`, {}, config);
            fetchCoupons();
        } catch (error) {
            alert("Error updating coupon");
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                await axios.delete(`/api/coupons/${id}`, config);
                fetchCoupons();
            } catch (error) {
                alert("Error deleting coupon");
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Tags className="text-primary" /> Promotion Coupons
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <PlusCircle size={18} /> Add Coupon
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
            ) : error ? (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                    <th className="p-4 border-b">Code</th>
                                    <th className="p-4 border-b">Value</th>
                                    <th className="p-4 border-b">Min Amount</th>
                                    <th className="p-4 border-b">Expiry</th>
                                    <th className="p-4 border-b">Status</th>
                                    <th className="p-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                                {coupons.map((coupon) => (
                                    <tr key={coupon._id} className="hover:bg-gray-50 transition-colors border-b last:border-b-0">
                                        <td className="p-4 font-bold text-gray-800">{coupon.code}</td>
                                        <td className="p-4">
                                            {coupon.discountType === "Percentage" 
                                                ? `${coupon.discountAmount}% (Max ₹${coupon.maxDiscountAmount})` 
                                                : `₹${coupon.discountAmount}`}
                                        </td>
                                        <td className="p-4">₹{coupon.minOrderAmount}</td>
                                        <td className="p-4">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <button onClick={() => toggleActiveHandler(coupon._id)}>
                                               {coupon.isActive ? (
                                                   <CheckCircle size={20} className="text-green-500" />
                                               ) : (
                                                   <XCircle size={20} className="text-red-500" />
                                               )}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <button onClick={() => deleteHandler(coupon._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {coupons.length === 0 && (
                                    <tr><td colSpan="6" className="p-8 text-center text-gray-500">No coupons found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Coupon Modal */}
            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                style={{
                    overlay: { backgroundColor: "rgba(0,0,0,0.5)", zIndex: 50 },
                    content: { top: "50%", left: "50%", right: "auto", bottom: "auto", marginRight: "-50%", transform: "translate(-50%, -50%)", padding: "24px", borderRadius: "12px", width: "90%", maxWidth: "500px", border: "none" }
                }}
            >
                <h2 className="text-xl font-bold mb-4">Create New Coupon</h2>
                <form onSubmit={createCouponHandler} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                        <input type="text" required value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} className="w-full px-3 py-2 border rounded-md uppercase" placeholder="e.g. SUMMER50" />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select value={newCoupon.discountType} onChange={e => setNewCoupon({...newCoupon, discountType: e.target.value})} className="w-full px-3 py-2 border rounded-md">
                                <option value="Percentage">Percentage %</option>
                                <option value="Fixed">Fixed Amount ₹</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                            <input type="number" required min="0" value={newCoupon.discountAmount} onChange={e => setNewCoupon({...newCoupon, discountAmount: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                    </div>
                    {newCoupon.discountType === "Percentage" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Amount (₹)</label>
                            <input type="number" required min="0" value={newCoupon.maxDiscountAmount} onChange={e => setNewCoupon({...newCoupon, maxDiscountAmount: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount (₹)</label>
                        <input type="number" required min="0" value={newCoupon.minOrderAmount} onChange={e => setNewCoupon({...newCoupon, minOrderAmount: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input type="date" required value={newCoupon.expiryDate} onChange={e => setNewCoupon({...newCoupon, expiryDate: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md font-medium border border-gray-200">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-blue-700">Create Coupon</button>
                    </div>
                </form>
            </ReactModal>
        </div>
    );
};

export default CouponListScreen;

