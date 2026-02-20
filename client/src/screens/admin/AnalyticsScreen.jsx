import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Activity, Clock, LogOut, Navigation, MousePointer, ShieldAlert, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AnalyticsScreen = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const [stats, setStats] = useState({
        summary: { totalSessions: 0, avgSessionDuration: 0, bounceRate: 0 },
        topPages: [],
        topExitPages: [],
        clickStats: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }

        const fetchStats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`
                    }
                };
                const { data } = await axios.get('/api/analytics/stats', config);
                setStats(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchStats();
    }, [userInfo, navigate]);

    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (error) return <div className="p-12 text-center text-red-500 bg-red-50 rounded-lg m-6"><ShieldAlert className="mx-auto mb-2" size={32} />{error}</div>;

    const formatDuration = (seconds) => {
        if (!seconds) return '0s';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <Activity className="text-primary" /> User Behavior Analytics
            </h1>

            {/* Overview KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Active Sessions</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.summary.totalSessions}</p>
                        <p className="text-xs text-gray-400 mt-1">Total tracked visits</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-full text-blue-500">
                        <MousePointer size={28} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Avg Session Time</p>
                        <p className="text-3xl font-bold text-gray-900">{formatDuration(stats.summary.avgSessionDuration)}</p>
                        <p className="text-xs text-gray-400 mt-1">Time spent per user</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-full text-green-500">
                        <Clock size={28} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Bounce Rate</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.summary.bounceRate}%</p>
                        <p className="text-xs text-gray-400 mt-1">Users leaving after 1 page</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-full text-red-500">
                        <LogOut size={28} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Most Visited Pages Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
                        <Navigation size={20} className="text-primary" /> Top Visited Pages
                    </h2>
                    <div className="h-72">
                        {stats.topPages.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.topPages} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        type="category"
                                        dataKey="path"
                                        width={120}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        formatter={(value) => value.length > 20 ? value.substring(0, 20) + '...' : value}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f9fafb' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="visits" fill="#2874f0" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">Not enough browsing data</div>
                        )}
                    </div>
                </div>

                {/* Exit Pages Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                        <LogOut size={20} className="text-red-500" /> Top Exit Pages
                    </h2>
                    <p className="text-xs text-gray-500 mb-4">Pages where users most frequently left your site.</p>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="p-3 font-semibold rounded-tl-lg">Page Path</th>
                                    <th className="p-3 font-semibold text-right rounded-tr-lg">Exit Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.topExitPages.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="p-6 text-center text-gray-400">No exit data available</td>
                                    </tr>
                                ) : (
                                    stats.topExitPages.map((exit, idx) => (
                                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="p-3 text-sm text-gray-700 font-medium truncate max-w-[200px]" title={exit.path}>
                                                {exit.path}
                                            </td>
                                            <td className="p-3 text-sm text-gray-900 text-right font-bold">
                                                {exit.exits}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Time spent per page */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                    <Clock size={20} className="text-green-500" /> Average Time on Top Pages
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.topPages.slice(0, 6).map((page, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                            <div className="truncate max-w-[70%] text-sm font-medium text-gray-700" title={page.path}>
                                {page.path}
                            </div>
                            <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-primary border border-blue-100 shadow-sm">
                                {formatDuration(page.avgTime)}
                            </div>
                        </div>
                    ))}
                    {stats.topPages.length === 0 && <div className="col-span-full text-gray-400 text-center py-4">No data collected yet.</div>}
                </div>
            </div>

            {/* Click Events / Button Tracker */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2 border-b pb-3">
                    <Zap size={20} className="text-yellow-500" /> Button Click Events
                </h2>
                <p className="text-xs text-gray-500 mb-4">Tracks user actions like adding to cart, removing items, applying coupons and proceeding to checkout.</p>

                {/* Event Labels Map */}
                {(() => {
                    const EVENT_META = {
                        'add_to_cart': { label: 'Add to Cart clicks', color: 'bg-green-100 text-green-700', emoji: '🛒' },
                        'remove_from_cart': { label: 'Remove from Cart', color: 'bg-red-100 text-red-700', emoji: '🗑️' },
                        'qty_increased': { label: 'Quantity Increased', color: 'bg-blue-100 text-blue-700', emoji: '➕' },
                        'coupon_applied': { label: 'Coupon Applied', color: 'bg-purple-100 text-purple-700', emoji: '🎟️' },
                        'coupon_removed': { label: 'Coupon Removed', color: 'bg-orange-100 text-orange-700', emoji: '❌' },
                        'checkout_clicked': { label: 'Proceeded to Checkout', color: 'bg-emerald-100 text-emerald-700', emoji: '✅' },
                    };
                    const clicks = stats.clickStats || [];
                    return clicks.length === 0 ? (
                        <div className="text-center text-gray-400 py-6">No click events tracked yet. Start browsing the site to generate data.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {clicks.map((c, idx) => {
                                const meta = EVENT_META[c.event] || { label: c.event, color: 'bg-gray-100 text-gray-700', emoji: '👆' };
                                return (
                                    <div key={idx} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white transition-colors">
                                        <div className={`text-2xl w-12 h-12 rounded-full flex items-center justify-center ${meta.color}`}>
                                            {meta.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-800">{meta.label}</p>
                                            <p className="text-xs text-gray-500">event: {c.event}</p>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">{c.count}</div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })()}
            </div>

        </div>
    );
};

export default AnalyticsScreen;
