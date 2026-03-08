import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Bell, MapPin, ChevronDown, Store } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import SocketContext from '../context/SocketContext';
import LocationContext from '../context/LocationContext';
import SmartButton from './SmartButton';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const socket = useContext(SocketContext);
    const { location } = useContext(LocationContext);
    const [notifications, setNotifications] = React.useState([]);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [showLocationModal, setShowLocationModal] = React.useState(false);
    const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false);
    const [animateCart, setAnimateCart] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (cartCount > 0) {
            setAnimateCart(true);
            const timer = setTimeout(() => setAnimateCart(false), 300);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);

    React.useEffect(() => {
        // Mock notifications for Super App demonstration
        setNotifications([
            { id: 1, type: 'action', color: 'bg-red-500', icon: '🔴', message: 'Upload your ID for your upcoming telehealth visit.' },
            { id: 2, type: 'live', color: 'bg-green-500', icon: '🟢', message: 'Your grocery delivery is 5 minutes away.' },
            { id: 3, type: 'cross', color: 'bg-purple-500', icon: '✨', message: 'Flight to Tokyo tomorrow! 🌧️ Need a jacket before you pack?' },
            { id: 4, type: 'reward', color: 'bg-yellow-500', icon: '💎', message: 'You just earned 500 points from your boat booking!' },
        ]);

        if (socket) {
            socket.on('newOrder', (order) => {
                setNotifications(prev => [...prev, { id: order._id, type: 'new_order', message: `New order #${order._id.substring(0, 8)}` }]);
            });

            socket.on('orderDelivered', (order) => {
                setNotifications(prev => [...prev, { id: order._id, type: 'delivered', message: `Order #${order._id.substring(0, 8)} delivered!` }]);
            });
        }
    }, [socket]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg ring-1 ring-white/20">
                        <Store size={22} className="text-white" />
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow-sm">Buy2<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Enjoy</span></span>
                </Link>
                <div className="nav-links flex items-center">
                    {/* Global Location Selector */}
                    <div className="relative flex items-center cursor-pointer mr-2" onClick={() => setShowLocationModal(!showLocationModal)}>
                        <div className="flex items-center gap-1.5 text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 transition-colors">
                            <MapPin size={16} className="text-[#34d399]" />
                            <span className="text-sm font-medium flex items-center gap-2">
                                <span>{location.city}{location.country !== 'Loading...' && location.country ? `, ${location.country}` : ''}</span>
                                {location.temperature !== null && location.temperature !== undefined && (
                                    <span className="text-xs font-bold bg-white/10 px-1.5 py-0.5 rounded-md text-sky-200">
                                        {Math.round(location.temperature)}°C
                                    </span>
                                )}
                            </span>
                            <ChevronDown size={14} className="text-gray-400" />
                        </div>
                        {showLocationModal && (
                            <div className="absolute top-10 right-0 w-64 rounded-xl p-4 shadow-2xl z-50 cursor-default" style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
                                <h3 className="text-white font-bold text-sm mb-3">Global Location</h3>
                                <p className="text-xs text-gray-400 mb-3 leading-relaxed">Your location sets the inventory and available bookings securely across the app.</p>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-gray-200">
                                    <div className="font-semibold text-white mb-1">Current Location</div>
                                    <div>📍 {location.city}, {location.country}</div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowLocationModal(false); }}
                                    className="w-full mt-3 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold rounded-lg transition-colors"
                                >
                                    Confirm
                                </button>
                            </div>
                        )}
                    </div>

                    <SmartButton
                        destination="/booking"
                        customClass="nav-link p-0 hover:text-primary transition-colors"
                        textClass=""
                        hoverClass=""
                        icon={<Package size={20} />}
                        label="Live Booking"
                    />

                    {user && (
                        <div className="relative flex items-center cursor-pointer mr-2">
                            <div onClick={() => setShowNotifications(!showNotifications)}>
                                <Bell size={20} className="text-secondary hover:text-primary transition-colors" />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                                        {notifications.length}
                                    </span>
                                )}
                            </div>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <div className="absolute top-10 right-0 w-80 rounded-xl p-4 shadow-2xl z-50 cursor-default" style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                                        <h3 className="text-white font-bold text-sm">Smart Notifications</h3>
                                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">{notifications.length} New</span>
                                    </div>

                                    {notifications.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-4">You're all caught up!</p>
                                    ) : (
                                        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                            {notifications.map(n => (
                                                <div key={n.id} className="flex gap-3 items-start p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                                                    <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${n.color}/10 border border-white/5`}>
                                                        {n.icon}
                                                    </div>
                                                    <p className="text-sm text-gray-200 leading-snug">{n.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {notifications.length > 0 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setNotifications([]); setShowNotifications(false); }}
                                            className="w-full mt-3 pt-3 border-t border-gray-700 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                                        >
                                            Dismiss All
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {user ? (
                        <>
                            <SmartButton
                                destination="/profile"
                                customClass="nav-link text-primary font-bold p-0"
                                textClass="" hoverClass=""
                                icon={<User size={20} />}
                                label={user.name}
                            />
                            {user.isAdmin && (
                                <>
                                    <SmartButton
                                        destination="/admin"
                                        customClass="nav-link p-0"
                                        textClass="" hoverClass=""
                                        label="Admin Panel"
                                    />
                                    <SmartButton
                                        destination="/admin/disputes"
                                        customClass="nav-link p-0 text-amber-400 font-bold"
                                        textClass="" hoverClass=""
                                        label="Disputes"
                                    />
                                </>
                            )}
                            <SmartButton
                                onClickOverride={handleLogout}
                                customClass="btn btn-outline"
                                textClass="" hoverClass=""
                                icon={<LogOut size={16} />}
                                label="Logout"
                            />
                        </>
                    ) : (
                        <SmartButton
                            destination="/login"
                            customClass="btn btn-primary"
                            textClass="" hoverClass=""
                            icon={<User size={16} />}
                            label="Sign In"
                        />
                    )}
                </div>
            </div>

            {/* Cart Slide-Drawer */}
            <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isCartDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCartDrawerOpen(false)}></div>
            <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-slate-900 border-l border-slate-700 shadow-2xl z-[101] transform transition-transform duration-300 ease-out ${isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShoppingCart className="text-indigo-400" /> Your Cart</h2>
                        <button onClick={() => setIsCartDrawerOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-slate-800 rounded-full p-1.5"><ChevronDown size={20} className="rotate-90" /></button>
                    </div>
                    {/* Cart contents summary */}
                    <div className="flex-grow flex flex-col items-center justify-center text-slate-500">
                        <Package size={56} className="mb-4 opacity-30" />
                        <p className="text-sm font-medium">Your mixed cart is ready.</p>
                        <p className="text-xs mt-1">Groceries + Travel + Healthcare</p>
                    </div>
                    <div className="mt-auto border-t border-slate-800 pt-6">
                        <div className="flex justify-between text-white font-bold text-lg mb-4">
                            <span>Subtotal</span>
                            <span>$0.00</span>
                        </div>
                        <SmartButton
                            label="Proceed to Secure Checkout"
                            icon="🔒"
                            customClass="w-full bg-indigo-600 hover:bg-indigo-500 text-white justify-center py-3 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all"
                            destination="/checkout"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
