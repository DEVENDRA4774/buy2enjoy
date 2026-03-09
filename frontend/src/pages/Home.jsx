import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Plane, Stethoscope, Wallet, ChevronRight, CloudLightning, ThermometerSun } from 'lucide-react';
import SmartButton from '../components/SmartButton';
import LocationContext from '../context/LocationContext';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { location } = useContext(LocationContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const [showMedicalModal, setShowMedicalModal] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);
    const [bankSearchTerm, setBankSearchTerm] = useState('');
    const [mockAccountNumber, setMockAccountNumber] = useState('');
    const [mockRoutingNumber, setMockRoutingNumber] = useState('');
    const navigate = useNavigate();

    // Dynamically generate categories based on location and weather
    const getDynamicCategories = () => {
        const baseCategories = [
            {
                title: 'Shop Limitless',
                icon: <ShoppingBag size={28} className="text-pink-400" />,
                color: 'rgba(236, 72, 153, 0.2)',
                borderColor: 'rgba(236, 72, 153, 0.5)',
                description: 'From everyday essentials to next-gen electronics and fashion, find exactly what you want, when you want it.',
                links: ['📱 Browse Latest Electronics', '👕 Explore Trending Fashion', '🛒 Stock up on Groceries', '📦 Re-order Favorites'],
                path: '/'
            },
            {
                title: 'Travel Live',
                icon: <Plane size={28} className="text-blue-400" />,
                color: 'rgba(96, 165, 250, 0.2)',
                borderColor: 'rgba(96, 165, 250, 0.5)',
                description: 'Never guess your departure time again. Book flights, trains, and boats with real-time, heartbeat status updates.',
                links: ['✈️ Secure Flight Tickets', '🚆 Track Express Trains', '🚢 Browse Ocean Cruises', '🚌 Intercity Bus Routes'],
                path: '/booking'
            },
            {
                title: 'Health First',
                icon: <Stethoscope size={28} className="text-emerald-400" />,
                color: 'rgba(52, 211, 153, 0.2)',
                borderColor: 'rgba(52, 211, 153, 0.5)',
                description: 'Your well-being, prioritized. Securely book doctor appointments, manage prescriptions, and access lab results in total privacy.',
                links: ['👨‍⚕️ Book an Online Consult', '💊 Auto-Refill Prescriptions', '🔬 View Private Lab Results'],
                path: '/health'
            },
            {
                title: 'Universal Wallet',
                icon: <Wallet size={28} className="text-purple-400" />,
                color: 'rgba(167, 139, 250, 0.2)',
                borderColor: 'rgba(167, 139, 250, 0.5)',
                description: 'Earn loyalty rewards across every sector. Pay bills, recharge, and checkout instantly with one unified balance.',
                links: ['⚡ 1-Click Bill Payments', '🔋 Instant Mobile Recharge', '💎 View Loyalty Rewards'],
                path: '/wallet'
            }
        ];

        // Apply Weather-Synced Commerce
        if (location?.weather === 'rain') {
            baseCategories[0].links.unshift('☔ Waterproof Gear & Umbrellas');
            baseCategories[0].description = `It's raining in ${location.city}! Stay dry with our 30-min delivery on essentials.`;
        } else if (location?.weather === 'heatwave') {
            baseCategories[0].links.unshift('🌡️ Fans & Coolers 15-Min Drop');
            baseCategories[0].description = `Heatwave alert in ${location.city}! Cool down fast with our priority AC & Fan delivery.`;
        }

        // Apply Micro-Fulfillment & Local Modules
        if (location?.city && location.city !== 'Loading...') {
            baseCategories[0].links.push(`🛵 Micro-Drop in ${location.city}`);
            baseCategories[1].links.unshift(`🚌 Local Transit for ${location.city}`);
            baseCategories[2].links.unshift(`🏥 Live Clinic Wait in ${location.city}`);
            baseCategories[2].links.unshift(`💊 SOS 24/7 Pharmacy near ${location.city}`);
            baseCategories[3].links.unshift(`🎟️ Weekend Gigs in ${location.city}`);
        }

        return baseCategories;
    };

    const dynamicCategories = getDynamicCategories();

    const [placeholderIndex, setPlaceholderIndex] = useState(0);

    const placeholders = [
        "Search for 'Noise Cancelling Headphones'...",
        "Search for 'Cardiologist near me'...",
        "Search for 'Flights to Tokyo'...",
        "Search for 'Organic Avocados'..."
    ];

    useEffect(() => {
        const pLen = placeholders.length;
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % pLen);
        }, 3000);
        return () => clearInterval(interval);
    }, [placeholders.length]);

    const getContextBanner = () => {
        if (location?.weather === 'rain') {
            return { title: "Heavy Rain Expected", subtitle: "Stay indoors. Order hot food & umbrellas.", icon: "⛈️", border: "border-blue-500", bg: "rgba(59, 130, 246, 0.6)", action: "/" };
        }
        if (location?.weather === 'heatwave') {
            return { title: "Extreme Heat Alert", subtitle: "Stay hydrated. AC servicing available.", icon: "🌡️", border: "border-orange-500", bg: "rgba(249, 115, 22, 0.6)", action: "/" };
        }
        const hour = new Date().getHours();
        if (hour >= 6 && hour <= 9) {
            return { title: "Morning Commute", subtitle: "Grab a quick coffee and check transit.", icon: "🌅", border: "border-amber-500", bg: "rgba(245, 158, 11, 0.6)", action: "/booking" };
        }
        return { title: "What's Happening?", subtitle: `Link your account to see events in ${location?.city || 'your area'}.`, icon: "🎪", border: "border-purple-500", bg: "rgba(168, 85, 247, 0.6)", action: "/login" };
    };
    const contextBanner = getContextBanner();

    const handleLinkClick = (e, link, categoryTitle) => {
        e.preventDefault();
        e.stopPropagation();
        if (categoryTitle === 'Health First' && link.includes('Doctor')) {
            navigate('/health');
        }
    };

    return (
        <div style={{ pointerEvents: 'none', minHeight: '80vh', display: 'flex', flexDirection: 'column', paddingTop: '2rem' }}>

            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '2rem', pointerEvents: 'auto' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: 'white', textShadow: '0 4px 15px rgba(0,0,0,0.8)', fontSize: '3.5rem', marginBottom: '0.5rem', fontWeight: '800' }}>
                    Shop, Travel, and Thrive. All in One Place.
                </h1>
                <p style={{ fontFamily: "'Montserrat', sans-serif", color: '#cbd5e1', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', marginBottom: '2rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                    Buy groceries, book a train, and see a doctor—without opening three different tabs.
                </p>
            </div>

            {/* Universal Search Bar */}
            <div style={{ pointerEvents: 'auto', alignSelf: 'center', width: '100%', maxWidth: '600px', marginBottom: '3rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(30, 41, 59, 0.85)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '50px',
                    padding: '0.75rem 1.5rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}>
                    <Search size={20} className="text-secondary mr-3" />
                    <input
                        type="text"
                        placeholder={placeholders[placeholderIndex]}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'color 0.5s ease',
                        }}
                    />
                    <div
                        onClick={() => {
                            if (!searchQuery.trim()) {
                                setIsShaking(true);
                                setTimeout(() => setIsShaking(false), 500);
                            } else {
                                navigate(`/search?q=${searchQuery}`);
                            }
                        }}
                        className={isShaking ? 'animate-shake' : ''}
                        style={{ background: '#6366f1', padding: '0.4rem 1.25rem', borderRadius: '30px', color: 'white', fontWeight: 'bold', cursor: 'pointer', marginLeft: '10px' }}
                    >
                        Search
                    </div>
                </div>

                {/* Micro-copy below search */}
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.9rem', color: '#94a3b8' }}>
                    Trending in {location?.city || 'your area'}:
                    <span onClick={() => setSearchQuery(`Local Events in ${location?.city || 'my area'}`)} className="cursor-pointer hover:text-white transition-colors ml-2" style={{ color: '#cbd5e1' }}>🎪 Local Events</span> |
                    <span onClick={() => setSearchQuery(`Food Delivery ${location?.city || ''}`)} className="cursor-pointer hover:text-white transition-colors mx-2" style={{ color: '#cbd5e1' }}>🍔 Food Delivery</span> |
                    <span onClick={() => setSearchQuery(`Doctors near ${location?.city || 'me'}`)} className="cursor-pointer hover:text-white transition-colors ml-2" style={{ color: '#cbd5e1' }}>🩺 Top Clinics</span>
                </div>
            </div>

            {/* 1. Link Account Button */}
            <div style={{ pointerEvents: 'auto', position: 'fixed', top: '5rem', right: '1.5rem', zIndex: 100 }}>
                <div onClick={() => setShowBankModal(true)}
                    className="hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                    style={{
                        background: 'rgba(99, 102, 241, 0.8)',
                        padding: '0.4rem 1.25rem',
                        borderRadius: '30px',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                    <span className="text-sm">🔗</span>
                    <span className="text-sm">Link Account</span>
                </div>
            </div>

            {/* Bank Link Modal */}
            {showBankModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4" style={{ pointerEvents: 'auto' }}>
                    <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_40px_rgba(99,102,241,0.15)] relative">
                        <button onClick={() => setShowBankModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                        <div className="bg-indigo-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                            <span className="text-3xl">🏦</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Secure Bank Link</h2>
                        <p className="text-indigo-400/80 text-sm mb-6">Enter mock details to simulate linking an external account to your Universal Wallet.</p>

                        <div className="flex flex-col gap-4 mb-6 text-left">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Search Bank</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        placeholder="Type to search (e.g. Chase, HDFC...)"
                                        value={bankSearchTerm}
                                        onChange={(e) => setBankSearchTerm(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 outline-none focus:border-indigo-500 mb-1"
                                    />
                                    <div className="custom-scrollbar" style={{ maxHeight: '120px', overflowY: 'auto', background: 'rgba(30, 41, 59, 1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                                        {[
                                            'Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'US Bank', 'PNC Bank', 'Truist', 'Capital One', 'TD Bank', 'Fifth Third Bank',
                                            'HDFC Bank', 'ICICI Bank', 'State Bank of India (SBI)', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank (PNB)', 'Bank of Baroda',
                                            'HSBC', 'Barclays', 'Standard Chartered', 'RBC Royal Bank', 'Scotiabank', 'BMO Bank of Montreal', 'CIBC', 'National Bank of Canada'
                                        ].filter(bank => bank.toLowerCase().includes(bankSearchTerm.toLowerCase())).map((bank, i) => (
                                            <div key={i} className="p-2 px-3 text-sm text-gray-300 hover:bg-indigo-600/30 hover:text-white cursor-pointer transition-colors border-b border-slate-700/50 last:border-0" onClick={() => setBankSearchTerm(bank)}>
                                                {bank}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Account Number (Test input)</label>
                                <input
                                    type="text"
                                    placeholder="123456789"
                                    value={mockAccountNumber}
                                    onChange={(e) => setMockAccountNumber(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Routing Number (Test input)</label>
                                <input
                                    type="text"
                                    placeholder="000111222"
                                    value={mockRoutingNumber}
                                    onChange={(e) => setMockRoutingNumber(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowBankModal(false)} className="flex-1 px-4 py-3 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 font-bold transition">Cancel</button>
                            <button
                                onClick={() => {
                                    if (!bankSearchTerm || !mockAccountNumber) {
                                        alert('Please select a bank and enter an account number for testing.');
                                        return;
                                    }
                                    localStorage.setItem('linkedBank', bankSearchTerm);
                                    localStorage.setItem('linkedAccount', mockAccountNumber);
                                    setShowBankModal(false);
                                    alert(`Mock Account Linked!\nBank: ${bankSearchTerm}\nAccount: ${mockAccountNumber}`);
                                    navigate('/wallet');
                                }}
                                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-bold shadow-lg shadow-indigo-600/30 transition"
                            >
                                Link Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Smart Home Dashboard Grid */}
            <div style={{ pointerEvents: 'auto', alignSelf: 'center', width: '100%', maxWidth: '1000px', marginBottom: '4rem' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dynamicCategories.map((category, idx) => (
                        <div key={idx} style={{
                            background: 'rgba(15, 23, 42, 0.75)',
                            backdropFilter: 'blur(16px)',
                            border: `1px solid ${category.borderColor}`,
                            borderRadius: '24px',
                            padding: '1.5rem',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'pointer',
                            boxShadow: `0 10px 30px rgba(0,0,0,0.3), inset 0 0 20px ${category.color}`
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = `0 15px 40px rgba(0,0,0,0.5), inset 0 0 30px ${category.color}`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = `0 10px 30px rgba(0,0,0,0.3), inset 0 0 20px ${category.color}`;
                            }}
                        >
                            <Link to={category.path} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
                                <div className="flex items-center mb-4">
                                    <div style={{
                                        padding: '12px',
                                        borderRadius: '16px',
                                        background: category.color,
                                        marginRight: '1rem'
                                    }}>
                                        {category.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold m-0" style={{ color: 'white' }}>{category.title}</h3>
                                </div>

                                <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                    {category.description}
                                </p>

                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                    {category.links.map((link, i) => {
                                        const match = link.match(/^(\p{Extended_Pictographic}|\S+)\s+(.*)$/u);
                                        const icon = match ? match[1] : <ChevronRight size={16} color={category.borderColor} />;
                                        const label = match ? match[2] : link;
                                        const isHighlight = link.includes('☔') || link.includes('🌡️') || link.includes('�') || link.includes('🚌') || link.includes('🏥') || link.includes('💊') || link.includes('🎟️');

                                        return (
                                            <li key={i} style={{ borderBottom: i === category.links.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                                                <SmartButton
                                                    icon={icon}
                                                    label={label}
                                                    destination={
                                                        (category.title === 'Health First' && (link.includes('Auto-Refill Prescriptions') || link.includes('View Private Lab Results'))) ? undefined : undefined
                                                    }
                                                    onClickOverride={(e) => {
                                                        if (category.title === 'Shop Limitless') {
                                                            let searchTerm = label;
                                                            if (label.includes('Electronics')) searchTerm = 'Electronics';
                                                            if (label.includes('Fashion')) searchTerm = 'Clothing';
                                                            if (label.includes('Groceries') || label.includes('Waterproof') || label.includes('Coolers')) searchTerm = 'Groceries';
                                                            if (label.includes('Micro-Drop')) searchTerm = 'Local Essentials';
                                                            window.open(`/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
                                                        } else if (category.title === 'Health First' && (link.includes('Auto-Refill Prescriptions') || link.includes('View Private Lab Results'))) {
                                                            setShowMedicalModal(true);
                                                        } else if (category.title === 'Health First' && link.includes('Doctor')) {
                                                            handleLinkClick(e, link, category.title);
                                                        } else {
                                                            navigate(category.path);
                                                        }
                                                    }}
                                                    customClass={`w-full justify-start text-left px-2 py-3 hover:bg-white/5 ${isHighlight ? 'text-[#fcd34d] font-bold' : 'text-[#cbd5e1]'}`}
                                                />
                                            </li>
                                        )
                                    })}
                                </ul>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. City Guide Carousel (Discover This Week) */}
            <div style={{ pointerEvents: 'auto', alignSelf: 'center', width: '100%', maxWidth: '1000px', marginBottom: '4rem' }}>
                <div className="flex items-center justify-between mb-4 px-2">
                    <div>
                        <h2 className="text-2xl font-bold text-white text-shadow-md">Discover This Week in {location?.city || 'Your Area'}</h2>
                        <p className="text-gray-400 text-sm mt-1">Hyper-local events, movies, and quick getaways.</p>
                    </div>
                    <SmartButton
                        label="See All"
                        customClass="text-indigo-400 hover:text-indigo-300 font-bold text-sm bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-full"
                        textClass="" hoverClass=""
                        destination="/wallet"
                    />
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbars" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {/* The Blockbuster Integration */}
                    <div className="snap-start flex-shrink-0 w-72 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl group cursor-pointer relative">
                        <div className="h-40 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80"></div>
                        </div>
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Trending Now</div>
                        <div className="p-4 relative -mt-10">
                            <h3 className="text-white font-bold text-lg mb-1">Dune: Part Two</h3>
                            <p className="text-gray-400 text-sm mb-3">IMAX 3D • PVR Icon, {location?.city || 'Local'}</p>
                            <SmartButton
                                label="Book 2 Seats"
                                icon="🎟️"
                                customClass="w-full bg-red-600 hover:bg-red-500 text-white justify-center"
                                destination="/wallet"
                            />
                        </div>
                    </div>

                    {/* Micro-Tourism: Weekend Trek */}
                    <div className="snap-start flex-shrink-0 w-72 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl group cursor-pointer relative">
                        <div className="h-40 bg-[url('https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80"></div>
                        </div>
                        <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">Weekend Escapes</div>
                        <div className="p-4 relative -mt-10">
                            <h3 className="text-white font-bold text-lg mb-1">Local Valley Trek</h3>
                            <p className="text-gray-400 text-sm mb-3">Pickup at 6 AM • Includes Breakfast</p>
                            <SmartButton
                                label="Book Trek & Cab"
                                icon="⛰️"
                                customClass="w-full bg-emerald-600 hover:bg-emerald-500 text-white justify-center"
                                destination="/booking"
                            />
                        </div>
                    </div>

                    {/* Live Events & Concerts */}
                    <div className="snap-start flex-shrink-0 w-72 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl group cursor-pointer relative">
                        <div className="h-40 bg-[url('https://images.unsplash.com/photo-1540039155732-680874b8fc47?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80"></div>
                        </div>
                        <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">Live Music</div>
                        <div className="p-4 relative -mt-10">
                            <h3 className="text-white font-bold text-lg mb-1">Acoustic Friday Night</h3>
                            <p className="text-gray-400 text-sm mb-3">Hard Rock Cafe, 5km away</p>
                            <SmartButton
                                label="Reserve Table"
                                icon="🎸"
                                customClass="w-full bg-purple-600 hover:bg-purple-500 text-white justify-center"
                                destination="/wallet"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust and Security Section: Verified Local Engine */}
            <div style={{ pointerEvents: 'auto', alignSelf: 'center', width: '100%', maxWidth: '1000px', marginTop: '1rem', marginBottom: '3rem' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '2rem 3rem',
                    textAlign: 'center'
                }}>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>The "Verified Local" Guarantee</h2>
                    <p className="text-gray-400 text-sm mb-4">Every vendor is strictly vetted for your safety. Look for these badges before you book.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        {/* Medical Shield */}
                        <div style={{ background: 'rgba(56, 189, 248, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.2)' }} className="relative">
                            <div className="absolute top-3 right-3 bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded-full border border-slate-700 shadow-sm">Live Since 2026</div>
                            <div className="flex items-center gap-3 mb-3">
                                <div style={{ background: 'rgba(56, 189, 248, 0.2)', padding: '8px', borderRadius: '50%' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-sky-400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
                                </div>
                                <h3 className="text-lg font-bold m-0" style={{ color: 'white' }}>License Verified</h3>
                            </div>
                            <p style={{ color: '#cbd5e1', fontSize: '0.90rem', margin: 0, lineHeight: '1.5' }}>
                                🩺 Medical clinics & pharmacies are heavily vetted before listing.
                            </p>
                        </div>

                        {/* Retail Star */}
                        <div style={{ background: 'rgba(250, 204, 21, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(250, 204, 21, 0.2)' }} className="relative">
                            <div className="absolute top-3 right-3 bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded-full border border-slate-700 shadow-sm">Live Since 2026</div>
                            <div className="flex items-center gap-3 mb-3">
                                <div style={{ background: 'rgba(250, 204, 21, 0.2)', padding: '8px', borderRadius: '50%' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-yellow-400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                </div>
                                <h3 className="text-lg font-bold m-0" style={{ color: 'white' }}>Top Rated Seller</h3>
                            </div>
                            <p style={{ color: '#cbd5e1', fontSize: '0.90rem', margin: 0, lineHeight: '1.5' }}>
                                🛍️ Only the highest quality local retail and grocery nodes.
                            </p>
                        </div>

                        {/* Transit Check */}
                        <div style={{ background: 'rgba(52, 211, 153, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(52, 211, 153, 0.2)' }} className="relative">
                            <div className="absolute top-3 right-3 bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded-full border border-slate-700 shadow-sm">Live Since 2026</div>
                            <div className="flex items-center gap-3 mb-3">
                                <div style={{ background: 'rgba(52, 211, 153, 0.2)', padding: '8px', borderRadius: '50%' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                </div>
                                <h3 className="text-lg font-bold m-0" style={{ color: 'white' }}>Safety Checked</h3>
                            </div>
                            <p style={{ color: '#cbd5e1', fontSize: '0.90rem', margin: 0, lineHeight: '1.5' }}>
                                🚗 Local cabs and tour guides are verified for absolute security.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vendor Onboarding Pitch */}
            <div style={{ pointerEvents: 'auto', alignSelf: 'center', width: '100%', maxWidth: '1000px', marginBottom: '5rem' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '24px',
                    padding: '3rem',
                    textAlign: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 30px rgba(59, 130, 246, 0.1)'
                }}>
                    <h2 className="text-3xl font-bold mb-2 text-white">Partner with Buy2Enjoy</h2>
                    <p className="text-[#cbd5e1] text-lg max-w-2xl mx-auto mb-6">Stop competing with giant delivery apps. We take a minimal flat fee and give you instant access to thousands of users right in your pin code.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-6">
                        <div className="bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors">
                            <h4 className="text-emerald-400 font-bold text-lg mb-2 flex items-center gap-2"><span>🏥</span> Pharmacies</h4>
                            <p className="text-sm text-gray-300">Deliver your stock locally within 30 minutes without the 30% aggregator cut.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors">
                            <h4 className="text-purple-400 font-bold text-lg mb-2 flex items-center gap-2"><span>⛰️</span> Local Guides</h4>
                            <p className="text-sm text-gray-300">List your weekend treks for free. We only get paid when you get a verified booking.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors">
                            <h4 className="text-blue-400 font-bold text-lg mb-2 flex items-center gap-2"><span>🩺</span> Clinics</h4>
                            <p className="text-sm text-gray-300">Stop WhatsApp chaos. Use our calendar. We charge deposits to stop no-shows.</p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <SmartButton
                            label="Claim Your Local Business Profile"
                            icon="🚀"
                            customClass="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 text-lg rounded-full"
                            destination="/wallet"
                        />
                    </div>
                </div>
            </div>

            {/* Medical Security Modal */}
            {showMedicalModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4" style={{ pointerEvents: 'auto' }}>
                    <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_40px_rgba(16,185,129,0.15)] relative">
                        <button onClick={() => setShowMedicalModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                        <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                            <span className="text-3xl">🔒</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Security Verification</h2>
                        <p className="text-emerald-400/80 text-sm mb-6">Enter your 4-digit Medical PIN or use Biometrics to access private health records.</p>

                        <div className="flex justify-center gap-3 mb-6 relative">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-14 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center font-bold text-xl text-white">_</div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowMedicalModal(false)} className="flex-1 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 text-sm font-bold transition">Cancel</button>
                            <button onClick={() => { setShowMedicalModal(false); alert('Biometric Verified! Access Granted.'); }} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 text-sm font-bold shadow-lg shadow-emerald-600/30 transition">Verify</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
