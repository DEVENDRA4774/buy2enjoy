import React, { useState } from 'react';
import { Package, Plane, Stethoscope, ChevronRight, ShieldCheck } from 'lucide-react';

const Checkout = () => {
    // Mock mixed cart for demonstration of Super App checkout
    const mockCart = {
        physical: [
            { id: 1, name: 'Cyberpunk LED Hoodie', price: 85.00, qty: 1 }
        ],
        travel: [
            { id: 2, name: 'Express Train to NY', price: 120.00, date: 'Oct 24, 14:30 EST', passengers: 1 }
        ],
        medical: [
            { id: 3, name: 'Comprehensive Blood Panel', price: 45.00, clinic: 'City Health Labs' }
        ]
    };

    const subtotal = 250.00; // 85 + 120 + 45
    const [pointsToApply, setPointsToApply] = useState(0);
    const maxPoints = 2000;
    const pointsValue = (pointsToApply / 100).toFixed(2); // 100 points = $1
    const finalTotal = (subtotal - pointsValue).toFixed(2);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate backend split-routing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="mt-8 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <ShieldCheck size={48} />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-white">Payment Successful!</h1>
                <p className="text-secondary max-w-lg mb-8 text-lg">
                    Your hoodie is preparing for shipment, your train ticket is confirmed, and your lab appointment is locked in.
                    <br /><br />
                    The funds have been securely distributed to our partners.
                </p>
                <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Return to World</button>
            </div>
        );
    }

    return (
        <div className="mt-8 mb-12 max-w-5xl mx-auto" style={{ pointerEvents: 'auto' }}>
            <h1 className="text-3xl font-extrabold mb-8 text-white text-shadow">Unified Checkout</h1>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Cart Blocks */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Block A: Shipping */}
                    <div className="card p-6" style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                        <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
                            <div className="p-2 bg-pink-500/20 rounded text-pink-400"><Package size={24} /></div>
                            <h2 className="text-xl font-bold text-white">Block A: Delivery (Physical Goods)</h2>
                        </div>
                        {mockCart.physical.map(item => (
                            <div key={item.id} className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="font-bold text-gray-200">{item.name}</p>
                                    <p className="text-sm text-gray-400">Qty: {item.qty}</p>
                                </div>
                                <p className="font-bold text-white">${item.price.toFixed(2)}</p>
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-gray-700">
                            <label className="text-sm text-gray-400 block mb-1">Verify Shipping Address</label>
                            <input type="text" className="form-control" defaultValue="123 Cyber Street, Neon City, NC 90210" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }} />
                        </div>
                    </div>

                    {/* Block B: Ticketing */}
                    <div className="card p-6" style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
                        <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
                            <div className="p-2 bg-blue-500/20 rounded text-blue-400"><Plane size={24} /></div>
                            <h2 className="text-xl font-bold text-white">Block B: Ticketing (Travel)</h2>
                        </div>
                        {mockCart.travel.map(item => (
                            <div key={item.id} className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="font-bold text-gray-200">{item.name}</p>
                                    <p className="text-sm text-gray-400">{item.date} • {item.passengers} Passenger(s)</p>
                                </div>
                                <p className="font-bold text-white">${item.price.toFixed(2)}</p>
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">Passenger Name</label>
                                <input type="text" className="form-control" defaultValue="John Doe" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-1">ID / Passport #</label>
                                <input type="text" className="form-control" placeholder="Required for boarding" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }} />
                            </div>
                        </div>
                    </div>

                    {/* Block C: Medical */}
                    <div className="card p-6" style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                        <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
                            <div className="p-2 bg-emerald-500/20 rounded text-emerald-400"><Stethoscope size={24} /></div>
                            <h2 className="text-xl font-bold text-white">Block C: Healthcare (Medical)</h2>
                        </div>
                        {mockCart.medical.map(item => (
                            <div key={item.id} className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="font-bold text-gray-200">{item.name}</p>
                                    <p className="text-sm text-gray-400">{item.clinic}</p>
                                </div>
                                <p className="font-bold text-white">${item.price.toFixed(2)}</p>
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-gray-700">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded border-gray-500" defaultChecked />
                                <span className="text-sm text-gray-300">I consent to secure sharing of my patient ID with City Health Labs for booking purposes.</span>
                            </label>
                        </div>
                    </div>

                </div>

                {/* Universal Payment Gateway */}
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-24" style={{ background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(49, 46, 129, 0.9) 100%)', backdropFilter: 'blur(16px)', border: '1px solid rgba(139, 92, 246, 0.4)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                        <h2 className="text-2xl font-bold mb-4 text-white border-b border-indigo-500/50 pb-4">Universal Payment</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-300">
                                <span>Cart Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-yellow-400 font-bold">
                                <span>Points Applied (-{pointsToApply})</span>
                                <span>-${pointsValue}</span>
                            </div>
                        </div>

                        {/* Points Slider */}
                        <div className="mb-8 p-4 bg-black/30 rounded-lg border border-yellow-500/30">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-sm text-gray-400">Apply Loyalty Points</p>
                                    <p className="font-bold text-yellow-400">{pointsToApply} / {maxPoints} pts</p>
                                </div>
                                <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold">Max -$20.00</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={maxPoints}
                                step="100"
                                value={pointsToApply}
                                onChange={(e) => setPointsToApply(Number(e.target.value))}
                                className="w-full accent-yellow-400 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="flex justify-between items-center mb-6 pt-4 border-t border-indigo-500/50">
                            <span className="text-lg text-gray-300">Final Total</span>
                            <span className="text-4xl font-extrabold text-white">${finalTotal}</span>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
                        >
                            {isProcessing ? (
                                <span className="animate-pulse">Processing Cross-Sector Routing...</span>
                            ) : (
                                <>Pay via Buy2Enjoy Wallet <ChevronRight /></>
                            )}
                        </button>

                        <p className="text-xs text-center text-indigo-300 mt-4">
                            <ShieldCheck size={14} className="inline mr-1 pb-1" />
                            Secure split-routing to 3 verified vendors.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
