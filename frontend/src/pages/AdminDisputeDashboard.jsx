import React, { useState } from 'react';
import { User, Store, DollarSign, CheckCircle, AlertTriangle, XCircle, Shield, ShoppingBag, Truck } from 'lucide-react';
import SmartButton from '../components/SmartButton';

const mockDispute = {
    id: "DISP-8921",
    status: "Open",
    order: {
        id: "ORD-1024",
        amount: "$45.00",
        date: "Oct 24, 2026, 14:30",
        items: ["Cyberpunk Hoodie (L)"],
        escrowStatus: "Frozen",
        category: "Retail"
    },
    user: {
        name: "Alex Mercer",
        id: "USR-773",
        trustScore: "85/100",
        refundRatio: "4%", // Low is good
        claim: "The cyberpunk hoodie arrived torn on the left sleeve.",
        evidence: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"]
    },
    vendor: {
        name: "Neon Threads Co.",
        id: "VND-402",
        rating: "4.8",
        badge: "Top Rated Seller",
        strikeCount: 0,
        defense: "Item was thoroughly checked before shipping. Damage likely occurred during transit.",
        history: "0 defect reports in last 90 days."
    }
};

const AdminDisputeDashboard = () => {
    const [dispute, setDispute] = useState(mockDispute);
    const [resolution, setResolution] = useState(null);

    const handleResolve = (action) => {
        setResolution(action);
        // In a real app, this would trigger backend API calls
        setTimeout(() => {
            alert(`Dispute ${dispute.id} Resolved: ${action}`);
        }, 500);
    };

    if (resolution) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 pt-24">
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center max-w-md w-full">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Dispute Resolved</h2>
                    <p className="text-slate-400 mb-6">Action taken: {resolution}</p>
                    <SmartButton
                        label="Next Case"
                        customClass="bg-blue-600 hover:bg-blue-500 text-white w-full justify-center"
                        onClickOverride={() => setResolution(null)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Shield className="text-rose-500" size={32} />
                            Resolution Center
                        </h1>
                        <p className="text-slate-400 mt-1">Case #{dispute.id} • {dispute.order.category}</p>
                    </div>
                    <div className="bg-rose-500/20 border border-rose-500/50 text-rose-400 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                        <AlertTriangle size={18} /> Escrow Frozen
                    </div>
                </div>

                {/* Split-Screen Case View */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                    {/* Left Panel: User Claim */}
                    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                            <div className="bg-blue-500/20 p-3 rounded-full">
                                <User className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">The Buyer</h2>
                                <p className="text-slate-400 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{dispute.user.name} ({dispute.user.id})</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Trust Score</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[85%]"></div>
                                    </div>
                                    <span className="text-emerald-400 font-bold text-sm">{dispute.user.trustScore}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Refund Ratio</span>
                                <p className="text-emerald-400 font-bold mt-1">{dispute.user.refundRatio} <span className="text-slate-400 font-normal text-xs">(Low Risk)</span></p>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                <span className="text-xs text-rose-400 uppercase font-bold tracking-wider block mb-2">User's Claim</span>
                                <p className="text-white text-sm">"{dispute.user.claim}"</p>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-2">Evidence</span>
                                <div className="h-32 w-full rounded-xl overflow-hidden border border-slate-700 relative group cursor-pointer">
                                    <img src={dispute.user.evidence[0]} alt="Evidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-bold text-sm">View Full</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Panel: Transaction Data */}
                    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                            <div className="bg-indigo-500/20 p-3 rounded-full">
                                <DollarSign className="text-indigo-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">The Transaction</h2>
                                <p className="text-slate-400 text-sm">Order {dispute.order.id}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                <div>
                                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Total Amount</span>
                                    <span className="text-2xl font-bold text-white">{dispute.order.amount}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Date</span>
                                    <span className="text-sm text-slate-300">{dispute.order.date}</span>
                                </div>
                            </div>

                            <div>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-2 flex items-center gap-2"><ShoppingBag size={14} /> Items</span>
                                <ul className="text-white text-sm list-disc list-inside">
                                    {dispute.order.items.map((item, idx) => (
                                        <li key={idx} className="text-slate-300">{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl flex items-start gap-3">
                                <div className="mt-1"><AlertTriangle className="text-rose-400" size={18} /></div>
                                <div>
                                    <h4 className="text-rose-400 font-bold text-sm mb-1">Escrow Status: Frozen</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed">Funds are securely locked in the operational vault. The 48-hour auto-release timer is paused pending admin resolution.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Vendor Defense */}
                    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                            <div className="bg-amber-500/20 p-3 rounded-full">
                                <Store className="text-amber-400" size={24} />
                            </div>
                            <div className="w-[180px]">
                                <h2 className="text-xl font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">{dispute.vendor.name}</h2>
                                <p className="text-slate-400 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{dispute.vendor.id}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-2">Vendor Status</span>
                                <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs font-bold border border-amber-500/30">
                                    ★ {dispute.vendor.badge} ({dispute.vendor.rating})
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">Automated Flags</span>
                                <p className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                                    <CheckCircle size={14} /> {dispute.vendor.strikeCount} Active Strikes
                                </p>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                <span className="text-xs text-amber-400 uppercase font-bold tracking-wider block mb-2">Vendor's Defense</span>
                                <p className="text-white text-sm italic">"{dispute.vendor.defense}"</p>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">Historical Context</span>
                                <p className="text-slate-300 text-sm flex items-center gap-2">
                                    <Truck size={14} className="text-slate-500" /> {dispute.vendor.history}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 1-Click Resolution Action Bar */}
                <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 sticky bottom-6 z-50">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-1">Admin Action Required</h3>
                        <p className="text-slate-400 text-sm">Select a resolution to unfreeze escrow.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => handleResolve('Refund User')}
                            className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/50 text-rose-400 px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                        >
                            <XCircle size={18} /> Refund User
                        </button>

                        <button
                            onClick={() => handleResolve('Split Difference')}
                            className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-400 px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                        >
                            <DollarSign size={18} /> Split Difference
                        </button>

                        <button
                            onClick={() => handleResolve('Release to Vendor')}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                        >
                            <CheckCircle size={18} /> Release to Vendor
                        </button>
                    </div>
                </div>
                <div className="mt-8 text-center text-slate-500 text-xs max-w-2xl mx-auto">
                    Note: Resolution triggers automated MongoDB updates to Orders, Dispute_Tickets, Vendor_Profiles, and User_Trust_Scores collections.
                </div>
            </div>
        </div>
    );
};

export default AdminDisputeDashboard;
