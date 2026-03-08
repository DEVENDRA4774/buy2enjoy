import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import api from '../utils/api';
import { ShoppingCart, CheckCircle, ShieldCheck, MapPin, Calendar, Clock, ChevronRight, Share2, Heart, Star, Truck, Shield, Video } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addedToCart, setAddedToCart] = useState(false);
    const [showStickyBar, setShowStickyBar] = useState(false);

    const { addToCart } = useContext(CartContext);
    const imageContainerRef = useRef(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch {
                setError('Failed to fetch product details.');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const handleScroll = () => {
            if (imageContainerRef.current) {
                const rect = imageContainerRef.current.getBoundingClientRect();
                setShowStickyBar(rect.bottom < 100);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getCategoryType = (cat) => {
        if (!cat) return 'retail';
        const travelCats = ['Trains', 'Flights', 'Hotels', 'Transport', 'Boat', 'Tickets'];
        const healthCats = ['Doctors', 'Labs', 'Pharmacy', 'Health', 'Consultations'];

        if (travelCats.some(c => cat.toLowerCase().includes(c.toLowerCase()))) return 'travel';
        if (healthCats.some(c => cat.toLowerCase().includes(c.toLowerCase()))) return 'health';
        return 'retail';
    };

    const addToCartHandler = (e) => {
        e.preventDefault();

        // Flying Animation Logics
        // We get the clicked button's position
        const btnRect = e.currentTarget.getBoundingClientRect();
        // Target is the nav-cart-icon element
        const cartIcon = document.getElementById('nav-cart-icon');

        if (cartIcon) {
            const cartRect = cartIcon.getBoundingClientRect();

            // Create flying element
            const flyingElement = document.createElement('div');
            flyingElement.className = 'flying-item bg-indigo-500 rounded-full flex items-center justify-center shadow-lg';
            flyingElement.style.width = '32px';
            flyingElement.style.height = '32px';
            flyingElement.style.left = `${btnRect.left + btnRect.width / 2 - 16}px`;
            flyingElement.style.top = `${btnRect.top + btnRect.height / 2 - 16}px`;

            // Calculate distance to travel
            const travelX = cartRect.left + cartRect.width / 2 - (btnRect.left + btnRect.width / 2);
            const travelY = cartRect.top + cartRect.height / 2 - (btnRect.top + btnRect.height / 2);

            flyingElement.style.setProperty('--fly-x', `${travelX}px`);
            flyingElement.style.setProperty('--fly-y', `${travelY}px`);

            // Apply icon inside
            flyingElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

            document.body.appendChild(flyingElement);

            // Clean up node after animation
            setTimeout(() => {
                flyingElement.remove();
                addToCart(product, Number(qty));
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2000); // reset state after 2 seconds
            }, 800);
        } else {
            // Fallback
            addToCart(product, Number(qty));
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    if (loading) return <div className="loader"></div>;
    if (error) return <div className="alert alert-danger mt-8">{error}</div>;

    const viewType = getCategoryType(product?.category);

    const renderRetailView = () => (
        <div className="grid md:grid-cols-2 gap-12">
            <div className="md:col-span-1" ref={imageContainerRef}>
                <div className="card h-full flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-200 shadow-xl rounded-2xl border border-white/20 relative group overflow-hidden" style={{ minHeight: '400px' }}>
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm z-10">
                        {product?.brand}
                    </div>
                    <div className="absolute top-4 right-4 bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md z-10 flex items-center gap-1 cursor-pointer hover:bg-red-500 hover:text-white transition-colors">
                        <Heart size={14} className="fill-current" /> Save
                    </div>
                    <img
                        src={product?.image}
                        alt={product?.name}
                        className="w-full h-auto object-contain max-h-[400px] drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-slate-400 p-8 text-center w-full h-full flex items-center justify-center rounded font-medium">Image Placeholder</span>'; }}
                    />
                </div>
            </div>
            {/* Details Section */}
            <div className="md:col-span-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-indigo-400 uppercase tracking-widest">
                    <span>Retail</span> <ChevronRight size={14} /> <span>{product?.category}</span>
                </div>
                <h1 className="text-4xl md:text-5xl mb-4 font-black tracking-tight text-white leading-tight">
                    {product?.name}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg text-sm font-bold">
                        <Star size={16} className="fill-current" /> 4.8
                    </div>
                    <span className="text-slate-400 text-sm underline decoration-slate-500/50 cursor-pointer hover:text-white transition-colors">124 Reviews</span>
                </div>

                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                    {product?.description}
                </p>

                {/* Visual Selectors */}
                <div className="mb-8 space-y-6">
                    <div>
                        <span className="block text-sm font-semibold text-slate-400 mb-3">Color</span>
                        <div className="flex gap-3">
                            {['bg-slate-900', 'bg-white', 'bg-indigo-500', 'bg-rose-500'].map((color, idx) => (
                                <button key={idx} className={`w-8 h-8 rounded-full ${color} shadow-inner border-2 ${idx === 0 ? 'border-indigo-400' : 'border-transparent'} hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500`}></button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <span className="block text-sm font-semibold text-slate-400 mb-3">Size</span>
                        <div className="flex gap-2">
                            {['S', 'M', 'L', 'XL'].map(size => (
                                <button key={size} className="w-12 h-10 rounded-xl border border-slate-600 flex items-center justify-center text-sm font-medium text-slate-300 hover:bg-white hover:text-slate-900 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none">{size}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trust Factors */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Delivery to Pune</p>
                            <p className="text-sm text-white font-bold">Tomorrow, by 9 PM</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium">Guarantee</p>
                            <p className="text-sm text-white font-bold">30-Day Return</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-400 mb-0.5">Price</p>
                        <p className="text-4xl font-black text-white">${product?.price}</p>
                    </div>
                    <div className="flex-2 flex justify-end">
                        {renderActionRow()}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTravelView = () => (
        <div className="max-w-4xl mx-auto">
            <div className="card bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden" ref={imageContainerRef}>
                {/* Background Maps Effect */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="bg-sky-500/20 text-sky-400 px-3 py-1 rounded-full text-xs font-bold border border-sky-500/20 backdrop-blur-md uppercase tracking-wider">
                            {product?.category}
                        </span>
                        <span className="text-slate-400 text-sm font-medium">{product?.brand} Airways</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-xs font-bold tracking-wide uppercase">Live Tracking Available</span>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-16 text-center tracking-tight drop-shadow-md">
                    {product?.name}
                </h1>

                {/* Timeline */}
                <div className="flex items-center justify-between px-4 md:px-12 mb-16 relative z-10">
                    <div className="text-center z-10 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-700/50 shadow-xl">
                        <p className="text-5xl font-black text-white mb-2">PNQ</p>
                        <p className="text-sm text-slate-400 font-medium">Pune, IN</p>
                        <p className="text-xs font-bold text-sky-400 mt-1">10:30 AM</p>
                    </div>

                    <div className="flex-1 flex items-center justify-center px-4 relative">
                        <div className="h-0.5 w-full bg-slate-700 relative flex items-center justify-center">
                            <div className="absolute w-full flex justify-between px-2 opacity-30">
                                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white"></div>)}
                            </div>
                            <div className="absolute text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2 shadow-lg">
                                <span className="text-xs font-bold">2h 15m</span>
                                <div className="text-sky-400"><MapPin size={16} /></div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center z-10 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-700/50 shadow-xl">
                        <p className="text-5xl font-black text-white mb-2">BOM</p>
                        <p className="text-sm text-slate-400 font-medium">Mumbai, IN</p>
                        <p className="text-xs font-bold text-sky-400 mt-1">12:45 PM</p>
                    </div>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-slate-700 relative z-10 shadow-inner">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Ticket Details</p>
                            <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">{product?.description}</p>

                            <div className="mt-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-400 font-bold tracking-wider uppercase block mb-1">Class</label>
                                    <select className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none">
                                        <option>Economy</option>
                                        <option>Business</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-slate-400 font-bold tracking-wider uppercase block mb-1">Passengers</label>
                                    <select
                                        value={qty}
                                        onChange={(e) => setQty(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                    >
                                        {[1, 2, 3, 4, 5].map(x => <option key={x} value={x}>{x}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-center border-l border-slate-800 pl-8">
                            <p className="text-sm font-medium text-slate-400 mb-1">Total Fare</p>
                            <p className="text-6xl font-black text-white mb-6">${product?.price}</p>
                            {renderActionRow('Secure Ticket', 'bg-sky-600 hover:bg-sky-500 shadow-sky-500/20')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderHealthView = () => (
        <div className="grid md:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch">
            <div className="md:col-span-4" ref={imageContainerRef}>
                <div className="card h-full bg-gradient-to-b from-slate-50 to-white shadow-xl rounded-3xl border border-slate-200 overflow-hidden relative">
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md z-10 flex items-center gap-1.5">
                        <ShieldCheck size={16} /> Verified License
                    </div>

                    <div className="pt-16 px-8 pb-8 flex flex-col items-center text-center">
                        <div className="w-56 h-56 rounded-full border-4 border-white shadow-xl overflow-hidden mb-8 bg-slate-100 relative">
                            <img
                                src={product?.image}
                                alt={product?.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + product?.name + '&size=256&background=0D8ABC&color=fff'; }}
                            />
                            {/* Online badge */}
                            <div className="absolute bottom-4 right-8 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">{product?.name}</h1>
                        <p className="text-emerald-600 font-bold text-sm mb-6 uppercase tracking-wider">{product?.brand}</p>

                        <div className="grid grid-cols-3 gap-4 w-full border-t border-slate-100 pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-black text-slate-900">80+</p>
                                <p className="text-xs font-medium text-slate-500 uppercase">Reviews</p>
                            </div>
                            <div className="text-center border-x border-slate-100">
                                <p className="text-2xl font-black text-slate-900">5Y+</p>
                                <p className="text-xs font-medium text-slate-500 uppercase">Experience</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1"><Star size={18} className="fill-current" /> 4.9</p>
                                <p className="text-xs font-medium text-slate-500 uppercase">Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:col-span-8 flex flex-col">
                <div className="bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-800 shadow-2xl flex-grow flex flex-col relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-800 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)] border border-indigo-500/20">
                            <Video size={28} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-xl mb-1">End-to-End Encrypted Session</h3>
                            <p className="text-slate-400 text-sm">Secure, private telehealth consultation from your home.</p>
                        </div>
                    </div>

                    <div className="mb-8 relative z-10">
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2"><CheckCircle size={18} className="text-emerald-400" /> About the Provider</h4>
                        <p className="text-slate-300 leading-relaxed p-5 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                            {product?.description}
                        </p>
                    </div>

                    {/* Time slots mock */}
                    <div className="mb-8 flex-grow relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-bold flex items-center gap-2"><Calendar size={18} className="text-emerald-400" /> Availability</h4>
                            <span className="text-indigo-400 text-sm font-medium cursor-pointer hover:text-indigo-300 transition-colors">See full calendar</span>
                        </div>
                        <div className="bg-slate-800/30 p-2 rounded-2xl border border-slate-700/50">
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                <div className="bg-slate-800 border-2 border-emerald-500 rounded-xl px-4 py-3 flex-shrink-0 cursor-pointer shadow-lg shadow-emerald-500/10">
                                    <p className="text-emerald-400 text-xs font-bold uppercase mb-1">Today</p>
                                    <p className="text-white font-bold text-lg">10:00 AM</p>
                                </div>
                                {['11:30 AM', '2:00 PM', '4:15 PM', '5:30 PM'].map((time, i) => (
                                    <div key={i} className="bg-slate-800/80 border-2 border-transparent hover:border-slate-600 rounded-xl px-4 py-3 flex-shrink-0 cursor-pointer transition-colors text-slate-300 hover:text-white">
                                        <p className="text-slate-500 text-xs font-bold uppercase mb-1">Today</p>
                                        <p className="font-bold text-lg">{time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-auto relative z-10">
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-0.5 uppercase tracking-wider">Consultation Fee</p>
                            <p className="text-4xl font-black text-white">${product?.price}</p>
                        </div>
                        {renderActionRow('Book Consultation', 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20')}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderActionRow = (actionText = 'Add To Cart', customBtnClass = 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20') => (
        <div className="flex items-center gap-4">
            {product?.countInStock > 0 && viewType === 'retail' && (
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-400 mb-1 ml-1 text-center">Qty</span>
                    <select
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        className="bg-slate-800 border border-slate-600 text-white font-bold rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer"
                        style={{ width: '80px', textAlign: 'center' }}
                    >
                        {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                                {x + 1}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <button
                className={`py-4 px-8 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 min-w-[220px] ${addedToCart ? 'bg-green-500 scale-95 shadow-green-500/20' : customBtnClass}`}
                disabled={product?.countInStock === 0}
                onClick={addToCartHandler}
            >
                {addedToCart ? (
                    <><CheckCircle size={20} className="animate-bounce" /> Added! ✅</>
                ) : (
                    <>{product?.countInStock === 0 ? 'Out of Stock' : actionText}</>
                )}
            </button>
        </div>
    );

    return (
        <div className="pb-32 relative">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium mb-8 transition-colors bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 hover:border-slate-600">
                <ChevronRight size={16} className="rotate-180" /> Back to listings
            </Link>

            {viewType === 'retail' && renderRetailView()}
            {viewType === 'travel' && renderTravelView()}
            {viewType === 'health' && renderHealthView()}

            {/* Cross-Sell Carousel */}
            <div className="mt-24 pt-12 border-t border-slate-800/50 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-black text-white mb-1">
                            {viewType === 'travel' ? 'Prepare for your trip' :
                                viewType === 'health' ? 'Optimize your health' :
                                    'Bought together globally'}
                        </h3>
                        <p className="text-slate-400 text-sm">Discover related items from across the Super App ecosystems.</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                        <button className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><ChevronRight size={18} className="rotate-180" /></button>
                        <button className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><ChevronRight size={18} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Mock Cross Sell Data based on viewType */}
                    {[1, 2, 3, 4].map((idx) => {
                        const defaultImage = `https://picsum.photos/seed/${product?._id || '123'}${idx}/200/200`;
                        const isHealth = viewType === 'health';
                        const isTravel = viewType === 'travel';
                        const name = isTravel ? `Universal Power Adapter v${idx}` : isHealth ? `Premium Multivitamins Pack ${idx}` : `Smart Wireless Earbuds ${idx}`;
                        const price = isTravel ? 24 + idx * 5 : isHealth ? 45 + idx * 2 : 129 + idx * 10;
                        const category = isTravel ? 'Electronics' : isHealth ? 'Pharmacy' : 'Accessories';

                        return (
                            <div key={idx} className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all cursor-pointer group transform hover:-translate-y-1">
                                <div className="bg-white rounded-xl h-40 mb-4 flex items-center justify-center p-4 overflow-hidden shadow-inner relative">
                                    <img src={defaultImage} className="h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="cross sell item" />
                                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur text-slate-900 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Heart size={14} className="fill-transparent hover:fill-red-500 hover:text-red-500 transition-colors" />
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1 block">{category}</span>
                                <h4 className="text-white font-bold mb-3 line-clamp-2 leading-snug">{name}</h4>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-white font-black text-lg">${price}</span>
                                    <button className="w-10 h-10 rounded-xl bg-slate-700/50 border border-slate-600 flex items-center justify-center text-white hover:bg-indigo-500 hover:border-indigo-400 shadow-md transition-all shrink-0">
                                        <ShoppingCart size={16} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className={`sticky-bottom-bar ${showStickyBar ? 'visible' : ''}`}>
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-slate-700 hidden sm:block bg-white flex-shrink-0 relative">
                            <img
                                src={product?.image || `https://ui-avatars.com/api/?name=${product?.name}&background=0D8ABC&color=fff`}
                                className="w-full h-full object-cover"
                                alt="thumb"
                            />
                        </div>
                        <div>
                            <p className="text-white font-bold text-base sm:text-lg line-clamp-1 mb-0.5">{product?.name}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded">{product?.category}</span>
                                <span className="text-slate-400 text-sm hidden md:inline-block">• {product?.brand}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right border-r border-slate-700 pr-6">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Total Amount</p>
                            <p className="text-3xl font-black text-white">${product?.price}</p>
                        </div>
                        {renderActionRow(
                            viewType === 'travel' ? 'Secure Ticket' : viewType === 'health' ? 'Book Consultation' : 'Add To Cart',
                            viewType === 'health' ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20' :
                                viewType === 'travel' ? 'bg-sky-600 hover:bg-sky-500 shadow-sky-500/20' :
                                    'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
