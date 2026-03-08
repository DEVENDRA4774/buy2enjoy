import React, { useState, useContext } from 'react';
import { User, Shield, CreditCard, Activity, Settings, Package, Plane, Stethoscope } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('account');

    // Dummy data for visual representation until backend is hooked up
    const loyaltyPoints = 1250;
    const currentTier = 'Gold Member';
    const nextTierPoints = 2000;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'account':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Account Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="text-sm text-gray-400">Full Name</label>
                                <input type="text" className="form-control" defaultValue={user?.name || ''} readOnly style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                            </div>
                            <div className="form-group">
                                <label className="text-sm text-gray-400">Email Address</label>
                                <input type="email" className="form-control" defaultValue={user?.email || ''} readOnly style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                            </div>
                        </div>
                        <button className="btn mt-4" style={{ background: '#6366f1', color: 'white' }}>Update Information</button>

                        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 mt-8">Security</h2>
                        <button className="btn btn-outline border-gray-500 text-gray-300 mr-4">Change Password</button>
                        <button className="btn btn-outline border-blue-500 text-blue-400">Enable 2FA</button>
                    </div>
                );
            case 'wallet':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">My Wallet & Payment</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* B2E Balance Card */}
                            <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                                <p className="text-blue-300 mb-2">B2E Balance</p>
                                <h3 className="text-4xl font-bold text-white mb-4">$0.00</h3>
                                <button className="btn w-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>+ Add Funds</button>
                            </div>
                            {/* Loyalty Points Card */}
                            <div style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-purple-300">Loyalty Points</p>
                                    <span className="bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded">{currentTier}</span>
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-4">{loyaltyPoints}</h3>
                                <div className="w-full bg-black/30 rounded-full h-2 mb-2">
                                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${(loyaltyPoints / nextTierPoints) * 100}%` }}></div>
                                </div>
                                <p className="text-xs text-purple-200">{nextTierPoints - loyaltyPoints} points to Platinum</p>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mt-8 mb-4">Linked Payment Methods</h3>
                        <div className="p-4 rounded-lg flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="flex items-center gap-4">
                                <CreditCard className="text-gray-400" />
                                <div>
                                    <p className="text-white font-bold">Visa ending in 4242</p>
                                    <p className="text-sm text-gray-400">Expires 12/28</p>
                                </div>
                            </div>
                            <button className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                        </div>
                    </div>
                );
            case 'activity':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Activity Hub</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to="/cart" className="p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors hover:bg-gray-800" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Package size={32} className="text-pink-400" />
                                <span className="text-white font-bold">Shopping History</span>
                            </Link>
                            <Link to="/booking" className="p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors hover:bg-gray-800" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Plane size={32} className="text-blue-400" />
                                <span className="text-white font-bold">Travel Itineraries</span>
                            </Link>
                            <Link to="/health" className="p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-colors hover:bg-gray-800" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Stethoscope size={32} className="text-emerald-400" />
                                <span className="text-white font-bold">Medical Records</span>
                            </Link>
                        </div>
                    </div>
                );
            case 'preferences':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Preferences</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div>
                                    <p className="text-white font-bold">Order Tracking Notifications</p>
                                    <p className="text-sm text-gray-400">Receive live updates on your deliveries.</p>
                                </div>
                                <input type="checkbox" defaultChecked className="toggle" />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div>
                                    <p className="text-white font-bold">Travel Alerts</p>
                                    <p className="text-sm text-gray-400">Get notified about gate changes and delays.</p>
                                </div>
                                <input type="checkbox" defaultChecked className="toggle" />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div>
                                    <p className="text-white font-bold">Promotional Offers</p>
                                    <p className="text-sm text-gray-400">Hear about new deals and loyalty rewards.</p>
                                </div>
                                <input type="checkbox" className="toggle" />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (!user) {
        return <div className="text-center mt-20 text-white">Please log in to view your profile.</div>;
    }

    return (
        <div className="mt-8 mb-12" style={{ pointerEvents: 'auto' }}>
            <h1 className="text-3xl font-extrabold mb-8 text-white text-shadow">User Profile Dashboard</h1>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="card p-4 space-y-2 sticky top-24" style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="flex items-center gap-3 p-4 mb-4 border-b border-gray-700">
                            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <p className="text-white font-bold">{user.name}</p>
                                <p className="text-xs text-indigo-300">{currentTier}</p>
                            </div>
                        </div>

                        <button
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'account' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            onClick={() => setActiveTab('account')}
                        >
                            <User size={20} /> Account Settings
                        </button>
                        <button
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'wallet' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            onClick={() => setActiveTab('wallet')}
                        >
                            <CreditCard size={20} /> My Wallet & Payment
                        </button>
                        <button
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'activity' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            onClick={() => setActiveTab('activity')}
                        >
                            <Activity size={20} /> Activity Hub
                        </button>
                        <button
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'preferences' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            onClick={() => setActiveTab('preferences')}
                        >
                            <Settings size={20} /> Preferences
                        </button>

                        <div className="pt-4 mt-4 border-t border-gray-700">
                            <button
                                className="w-full flex items-center justify-center font-bold gap-3 p-3 rounded-lg text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg"
                                onClick={async () => { await logout(); navigate('/login'); }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <div className="card p-8" style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', minHeight: '600px' }}>
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
