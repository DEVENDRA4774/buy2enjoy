import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Package, Calendar, DollarSign, TrendingUp, Settings, Bell, CircleCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const VendorDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');

    // Make sure they have a reason to be here (we'd use isVendor or isProvider in reality)
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Mock Business Data
    const mockOrders = [
        { id: 'ORD-8821', product: 'Cyberpunk LED Hoodie', customer: 'Alice M.', status: 'Pending', date: 'Oct 24, 2026', amount: '$85.00' },
        { id: 'ORD-8822', product: 'Wireless Audio Streamer', customer: 'David L.', status: 'Shipped', date: 'Oct 23, 2026', amount: '$120.00' },
        { id: 'ORD-8823', product: 'Smart Neon Planter', customer: 'Sarah K.', status: 'Delivered', date: 'Oct 21, 2026', amount: '$45.00' },
    ];

    const weeklyViewsData = [
        { name: 'Mon', views: 400 },
        { name: 'Tue', views: 300 },
        { name: 'Wed', views: 550 },
        { name: 'Thu', views: 480 },
        { name: 'Fri', views: 700 },
        { name: 'Sat', views: 900 },
        { name: 'Sun', views: 850 },
    ];

    const renderFulfillment = () => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Active Orders / Appointments</h2>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg text-sm border border-blue-100">Pending (1)</button>
                    <button className="px-4 py-2 bg-gray-50 text-gray-600 font-medium rounded-lg text-sm border border-gray-200 hover:bg-gray-100">All Time</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-100 text-gray-500 text-sm">
                            <th className="py-3 px-4 font-semibold">Order ID</th>
                            <th className="py-3 px-4 font-semibold">Item / Service</th>
                            <th className="py-3 px-4 font-semibold">Customer</th>
                            <th className="py-3 px-4 font-semibold">Date</th>
                            <th className="py-3 px-4 font-semibold text-right">Amount</th>
                            <th className="py-3 px-4 font-semibold text-center">Status</th>
                            <th className="py-3 px-4 font-semibold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockOrders.map((order, i) => (
                            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-4 font-medium text-gray-800">{order.id}</td>
                                <td className="py-4 px-4 text-gray-600">{order.product}</td>
                                <td className="py-4 px-4 text-gray-600">{order.customer}</td>
                                <td className="py-4 px-4 text-gray-500 text-sm">{order.date}</td>
                                <td className="py-4 px-4 font-bold text-gray-800 text-right">{order.amount}</td>
                                <td className="py-4 px-4 text-center">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    {order.status === 'Pending' ? (
                                        <button className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded text-sm font-medium transition-colors">
                                            Mark Shipped
                                        </button>
                                    ) : (
                                        <button className="text-gray-400 hover:text-indigo-600 p-1.5 transition-colors">
                                            <Settings size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderLedger = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded">+12.5%</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Available for Payout</p>
                    <h3 className="text-3xl font-bold text-gray-800">$1,450.00</h3>
                    <p className="text-xs text-gray-400 mt-4">Next automated transfer: Oct 28</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Gross Volume (30d)</p>
                    <h3 className="text-3xl font-bold text-gray-800">$4,820.00</h3>
                    <p className="text-xs text-gray-400 mt-4">Across 42 successful transactions</p>
                </div>
                <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500 opacity-20 blur-xl"></div>
                    <h3 className="text-lg font-bold mb-2 relative z-10">B2E Platform Fees</h3>
                    <p className="text-gray-300 text-sm mb-6 relative z-10">You're currently on the 0% upfront listing plan. We only charge when you make a sale.</p>
                    <button className="w-full bg-white text-gray-900 font-bold py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors relative z-10">
                        View Fee Schedule
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Payouts</h2>
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg mb-3">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 text-green-600 p-2 rounded-full"><CircleCheck size={20} /></div>
                        <div>
                            <p className="font-bold text-gray-800">Transfer to Bank Ending in 9924</p>
                            <p className="text-sm text-gray-500">Oct 14, 2026</p>
                        </div>
                    </div>
                    <span className="font-bold text-gray-800">$850.00</span>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 text-green-600 p-2 rounded-full"><CircleCheck size={20} /></div>
                        <div>
                            <p className="font-bold text-gray-800">Transfer to Bank Ending in 9924</p>
                            <p className="text-sm text-gray-500">Oct 07, 2026</p>
                        </div>
                    </div>
                    <span className="font-bold text-gray-800">$520.00</span>
                </div>
            </div>
        </div>
    );

    const renderAnalytics = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Profile & Listing Views (This Week)</h2>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weeklyViewsData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Line type="monotone" dataKey="views" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Cross-Sell Attribution</h2>
                <p className="text-sm text-gray-600 mb-6">How users are finding your products within the Super App.</p>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">Direct Search</span>
                            <span className="font-bold text-gray-800">45%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">Travel Cross-Sell (Dynamic)</span>
                            <span className="font-bold text-gray-800">35%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">Super App Front Page</span>
                            <span className="font-bold text-gray-800">20%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-pink-400 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Apply a completely different theme (white-label) overlay on top of the 3D background
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative z-50 text-gray-900 pointer-events-auto" style={{ margin: '-2rem' }}>
            {/* Vendor Navbar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 text-white p-1.5 rounded-lg"><Package size={20} /></div>
                        <span className="font-bold text-xl tracking-tight text-gray-900 border-r border-gray-200 pr-4 mr-4">Buy2<span className="text-indigo-600">Enjoy</span></span>
                        <span className="font-medium text-gray-500 tracking-wide">VENDOR DASHBOARD</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-gray-600">
                            <Bell size={20} />
                        </button>
                        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user?.name || 'Vendor Profile'}</span>
                        </div>
                        <button className="ml-2 text-sm text-gray-400 hover:text-indigo-600 font-medium" onClick={() => navigate('/')}>
                            Exit to App
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex gap-8">

                {/* Side Navigation */}
                <aside className="w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Calendar size={18} className={activeTab === 'orders' ? 'text-indigo-700' : 'text-gray-400'} />
                            Fulfillment Desk
                        </button>
                        <button
                            onClick={() => setActiveTab('ledger')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'ledger' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <DollarSign size={18} className={activeTab === 'ledger' ? 'text-indigo-700' : 'text-gray-400'} />
                            Financial Ledger
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <TrendingUp size={18} className={activeTab === 'analytics' ? 'text-indigo-700' : 'text-gray-400'} />
                            Platform Analytics
                        </button>
                        <div className="my-4 border-t border-gray-200"></div>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                            <Settings size={18} className="text-gray-400" />
                            Store Settings
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activeTab === 'orders' ? 'Fulfillment Desk' :
                                activeTab === 'ledger' ? 'Financial Ledger' :
                                    'Platform Analytics'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {activeTab === 'orders' ? 'Manage your upcoming orders and appointments.' :
                                activeTab === 'ledger' ? 'Track your revenue, payouts, and platform fees.' :
                                    'See how your business is growing within the Super App ecosystem.'}
                        </p>
                    </div>

                    {activeTab === 'orders' && renderFulfillment()}
                    {activeTab === 'ledger' && renderLedger()}
                    {activeTab === 'analytics' && renderAnalytics()}

                </main>
            </div>
        </div>
    );
};

export default VendorDashboard;
