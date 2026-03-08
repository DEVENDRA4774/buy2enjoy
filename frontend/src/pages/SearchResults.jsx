import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingBag, Plane, Stethoscope, ChevronRight, Package, AlertCircle, Search } from 'lucide-react';
import SmartButton from '../components/SmartButton';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [isLoading, setIsLoading] = useState(true);
    const [loadingText, setLoadingText] = useState('Initializing Universal Search Engine...');
    const [activeFilter, setActiveFilter] = useState('All Results');
    const [isShimmering, setIsShimmering] = useState(false);

    // Filter Categories
    const filters = ['All Results', 'Electronics', 'Groceries', 'Doctors', 'Live Travel'];

    // Mock Dynamic Data Generation based on Query
    const generateResults = (q) => {
        const lowerQ = q.toLowerCase();

        let bestMatch = null;
        let electronics = [];
        let groceries = [];
        let health = [];
        let travel = [];

        // Logic routing based on keywords
        if (lowerQ.includes('apple') || lowerQ.includes('electronic') || lowerQ.includes('tech') || lowerQ.includes('gadget')) {
            bestMatch = {
                type: 'Electronics',
                title: 'iPhone 16 Pro Max',
                price: '$1199',
                image: 'https://images.unsplash.com/photo-1694806540304-45e0fb14b62d?q=80&w=600&auto=format&fit=crop',
                action: 'Add to Cart',
                color: 'bg-blue-600',
                description: 'Super Retina XDR display with ProMotion. Aerospace-grade titanium design.'
            };
            electronics = [
                { id: 1, title: 'MacBook Air M3', price: '$1099', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop', description: 'Supercharged by M3. 18 hours of battery.' },
                { id: 2, title: 'AirPods Pro 2', price: '$249', image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=400&auto=format&fit=crop', description: 'Active Noise Cancellation and Personalized Spatial Audio.' },
                { id: 5, title: 'Sony WH-1000XM5', price: '$348', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=400&auto=format&fit=crop', description: 'Industry leading noise cancellation headphones.' },
                { id: 6, title: 'Samsung Galaxy S24 Ultra', price: '$1299', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=400&auto=format&fit=crop', description: 'Galaxy AI is here. Welcome to the era of mobile AI.' },
                { id: 7, title: 'Nintendo Switch OLED', price: '$349', image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=400&auto=format&fit=crop', description: 'Play at home or on the go with a vibrant 7-inch OLED screen.' },
            ];
            if (lowerQ.includes('apple')) {
                groceries = [
                    { id: 3, title: 'Fuji Apples (1kg)', price: '$4.99', icon: '🍎' },
                    { id: 4, title: 'Green Apples (Local)', price: '$3.50', icon: '🍏' }
                ];
            }
        } else if (lowerQ.includes('cold') || lowerQ.includes('para')) {
            bestMatch = { type: 'Pharmacy', title: 'Paracetamol 500mg Instant', time: '10 min delivery', image: '💊', action: 'Buy Now', color: 'bg-emerald-600' };
            health = [
                { id: 1, title: 'Dr. Sarah (General Physician)', status: 'Available Now', icon: '👩‍⚕️' },
                { id: 2, title: 'Cough Syrup (Max)', price: '$8.00', icon: '🧴' }
            ];
            groceries = [
                { id: 3, title: 'Hot Chicken Soup', price: '$5.50', icon: '🍲' },
                { id: 4, title: 'Herbal Tea Pack', price: '$12.00', icon: '☕' }
            ];
        } else if (lowerQ.includes('train') || lowerQ.includes('mumbai') || lowerQ.includes('delhi')) {
            bestMatch = { type: 'Travel', title: 'Express Rail: Pune → Mumbai', time: 'Departs in 45m', image: '🚄', action: 'Book Fast Track', color: 'bg-indigo-600' };
            travel = [
                { id: 1, title: 'Vande Bharat Express', status: 'On Time', icon: '🚆' },
                { id: 2, title: 'Intercity AC Bus', price: '$15', icon: '🚌' }
            ];
        } else if (lowerQ.trim() === '') {
            // Handled by zero results
        }

        return { bestMatch, electronics, groceries, health, travel };
    };

    const results = generateResults(query);
    const hasAnyResults = results.bestMatch || results.electronics.length || results.groceries.length || results.health.length || results.travel.length;

    // Simulate the 1.5s "Smart Loader"
    useEffect(() => {
        const cycle1 = setTimeout(() => setLoadingText('Scanning local vendors...'), 300);
        const cycle2 = setTimeout(() => setLoadingText('Checking real-time flight routes...'), 700);
        const cycle3 = setTimeout(() => setLoadingText('Syncing secure health portals...'), 1100);

        const finish = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => {
            clearTimeout(cycle1); clearTimeout(cycle2); clearTimeout(cycle3); clearTimeout(finish);
        };
    }, [query]);

    // Handle Filter Change with Shimmer
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        setIsShimmering(true);
        setTimeout(() => setIsShimmering(false), 800); // 0.8s shimmer transition
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-4xl mx-auto px-4 pointer-events-auto">
                {/* Skeleton UI Blocks */}
                <div className="w-full flex gap-3 mb-8 overflow-hidden">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-10 w-24 bg-slate-800/50 rounded-full animate-pulse flex-shrink-0 border border-slate-700"></div>
                    ))}
                </div>
                <div className="w-full h-48 bg-slate-800/60 rounded-2xl animate-pulse mb-8 border border-slate-700"></div>

                <div className="w-full grid justify-center gap-4">
                    <div className="loader mt-0 mb-4 border-t-indigo-500"></div>
                    <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 animate-pulse text-center">
                        {loadingText}
                    </p>
                </div>

                <div className="w-full mt-12">
                    <div className="h-6 w-48 bg-slate-800/50 rounded animate-pulse mb-4"></div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 w-64 bg-slate-800/40 rounded-xl animate-pulse flex-shrink-0 border border-slate-700"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!hasAnyResults) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-3xl mx-auto px-4 text-center pointer-events-auto">
                <div className="mt-10 mb-8 p-6 bg-slate-800/50 rounded-full border border-slate-700 flex items-center justify-center shadow-lg w-32 h-32 mx-auto">
                    <Search className="text-slate-400" size={64} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">No results found</h1>
                <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
                    We couldn't find a match for <span className="text-white font-bold">"{query}"</span>. Please check for typos or try using broader search terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <SmartButton label="Back to Homepage" icon={<ShoppingBag size={18} />} customClass="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 px-6 shadow-lg transition-transform hover:scale-105" destination="/" />
                </div>
            </div>
        );
    }

    // Helper to check if a section should be rendered based on active filter
    const showSection = (filterName) => activeFilter === 'All Results' || activeFilter === filterName;

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 pointer-events-auto">
            {/* Context Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Search Results for "{query}"</h1>

                {/* Filter Pills (Quick Sorting) */}
                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbars mt-4">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => handleFilterChange(filter)}
                            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeFilter === filter
                                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-500'
                                : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`transition-opacity duration-500 ${isShimmering ? 'opacity-40 blur-sm scale-[0.99] grayscale-[50%]' : 'opacity-100 blur-0 scale-100 grayscale-0'}`}>

                {/* Top Section: The "Best Match" (Hero Result) */}
                {results.bestMatch && activeFilter === 'All Results' && (
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">★ Best Match</span>
                            <span className="text-slate-400 text-sm">{results.bestMatch.type}</span>
                        </div>
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-slate-500 transition-colors">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-500/20 transition-colors"></div>

                            <div className="flex items-center gap-6 z-10 w-full md:w-auto">
                                <div className="text-6xl md:text-8xl drop-shadow-2xl">{results.bestMatch.image}</div>
                                <div>
                                    <h2 className="text-2xl md:text-4xl font-black text-white mb-2">{results.bestMatch.title}</h2>
                                    <p className="text-slate-300 text-lg font-medium">{results.bestMatch.price || results.bestMatch.time}</p>
                                </div>
                            </div>

                            <div className="w-full md:w-auto z-10">
                                <button className={`w-full md:w-auto ${results.bestMatch.color} hover:opacity-90 text-white font-bold text-lg py-4 px-10 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95`}>
                                    {results.bestMatch.action}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Middle Sections: The Categorized Swimlanes */}

                {showSection('Electronics') && results.electronics.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><div className="w-2 h-6 bg-blue-500 rounded-full"></div> Electronics</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbars">
                            {results.electronics.map(item => (
                                <div key={item.id} className="snap-start flex-shrink-0 w-64 bg-slate-800/80 border border-slate-700 rounded-2xl p-5 hover:bg-slate-700/80 transition-colors cursor-pointer group">
                                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform origin-bottom-left">{item.icon}</div>
                                    <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                                    <p className="text-blue-400 font-bold">{item.price}</p>
                                </div>
                            ))}
                            {/* Phantom "View More" card for horizontal UX */}
                            <div className="snap-start flex-shrink-0 w-32 bg-slate-800/40 border border-slate-700/50 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center hover:bg-slate-800 hover:border-slate-600 transition-colors cursor-pointer">
                                <ChevronRight className="text-slate-500 mb-2" size={32} />
                                <span className="text-slate-400 text-sm font-bold">View All</span>
                            </div>
                        </div>
                    </div>
                )}

                {showSection('Groceries') && results.groceries.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><div className="w-2 h-6 bg-emerald-500 rounded-full"></div> Quick Groceries (15-min)</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbars">
                            {results.groceries.map(item => (
                                <div key={item.id} className="snap-start flex-shrink-0 w-64 bg-slate-800/80 border border-slate-700 rounded-2xl p-5 hover:bg-slate-700/80 transition-colors cursor-pointer group">
                                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform origin-bottom-left">{item.icon}</div>
                                    <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-emerald-400 font-bold">{item.price}</span>
                                        <button className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-full p-2 transition-colors">
                                            <Package size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {showSection('Doctors') && results.health.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><div className="w-2 h-6 bg-pink-500 rounded-full"></div> Health & Care</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbars">
                            {results.health.map(item => (
                                <div key={item.id} className="snap-start flex-shrink-0 w-72 bg-slate-800/80 border border-slate-700 rounded-2xl p-5 hover:bg-slate-700/80 transition-colors cursor-pointer group">
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl bg-slate-900 p-3 rounded-xl border border-slate-700">{item.icon}</div>
                                        <div>
                                            <h4 className="text-white font-bold text-md mb-1">{item.title}</h4>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${item.status ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>
                                                {item.status || item.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {showSection('Live Travel') && results.travel.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><div className="w-2 h-6 bg-orange-500 rounded-full"></div> Travel & Transit</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbars">
                            {results.travel.map(item => (
                                <div key={item.id} className="snap-start flex-shrink-0 w-72 bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 rounded-2xl p-5 hover:border-orange-500/50 transition-colors cursor-pointer relative overflow-hidden">
                                    <div className="absolute right-0 top-0 text-7xl opacity-5 -mt-4 -mr-4">{item.icon}</div>
                                    <h4 className="text-white font-bold text-lg mb-2 relative z-10">{item.title}</h4>
                                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium bg-slate-900/50 inline-flex px-3 py-1 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        {item.status || item.price}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SearchResults;
