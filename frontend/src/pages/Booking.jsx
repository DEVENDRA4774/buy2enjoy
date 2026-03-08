import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, Compass } from 'lucide-react';
import EmptyState from '../components/EmptyState';

const initialBookings = [
    { id: 'TR-402', type: 'Train', name: 'Express Line 5', route: 'New York -> Washington DC', status: 'On Time', time: '14:30 EST', price: '$85.00' },
    { id: 'FL-899', type: 'Flight', name: 'AeroJet Air', route: 'London (LHR) -> Paris (CDG)', status: 'Boarding', time: '09:15 BST', price: '$120.00' },
    { id: 'BT-101', type: 'Boat', name: 'Oceanic Cruise Link', route: 'Miami -> Bahamas', status: 'Delayed', time: '11:00 EST', price: '$450.00' },
    { id: 'TR-102', type: 'Train', name: 'Bullet Express', route: 'Tokyo -> Kyoto', status: 'Arriving', time: '13:05 JST', price: '$110.00' },
    { id: 'FL-220', type: 'Flight', name: 'Global wings', route: 'Dubai (DXB) -> Mumbai (BOM)', status: 'On Time', time: '22:45 GST', price: '$340.00' },
    { id: 'BT-55', type: 'Boat', name: 'Thames Clipper', route: 'Westminster -> Greenwich', status: 'Departed', time: '15:20 BST', price: '$15.00' }
];

const Booking = () => {
    const [bookings, setBookings] = useState(initialBookings);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('mytrips'); // Start on my trips to show off the empty state

    // Simulate Live Updates
    useEffect(() => {
        // Initial fetch simulation
        const fetchTimer = setTimeout(() => setLoading(false), 2000);

        const interval = setInterval(() => {
            const statuses = ['On Time', 'Delayed', 'Boarding', 'Arriving', 'Departed'];

            setBookings(prev => prev.map(booking => {
                // Randomly change status of one item every interval
                if (Math.random() > 0.7) {
                    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    return { ...booking, status: newStatus };
                }
                return booking;
            }));
        }, 5000); // Live update every 5 seconds

        return () => {
            clearInterval(interval);
            clearTimeout(fetchTimer);
        };
    }, []);

    // eslint-disable-next-line no-unused-vars
    const getTypeColor = (type) => {
        if (type === 'Train') return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30 line-through'; // Using CSS color approach or standard tailwind classes normally, but we use inline styles for reliability
        if (type === 'Flight') return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
        if (type === 'Boat') return 'text-teal-500 bg-teal-100 dark:bg-teal-900/30';
        return 'text-gray-500';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'On Time': return '#10b981'; // Success Green
            case 'Delayed': return '#ef4444'; // Red
            case 'Boarding': return '#3b82f6'; // Blue
            case 'Arriving': return '#f59e0b'; // Yellow
            case 'Departed': return '#6b7280'; // Gray
            default: return '#cbd5e1';
        }
    };

    return (
        <div style={{ pointerEvents: 'auto', paddingTop: '2rem' }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold" style={{ color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {activeTab === 'live' ? 'Live Travel Booking' : 'My Itinerary'}
                </h1>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.6)', borderRadius: '30px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button
                            style={{
                                padding: '0.4rem 1.25rem', borderRadius: '30px',
                                background: activeTab === 'mytrips' ? '#6366f1' : 'transparent',
                                color: activeTab === 'mytrips' ? 'white' : '#cbd5e1',
                                fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease'
                            }}
                            onClick={() => setActiveTab('mytrips')}
                        >
                            My Trips
                        </button>
                        <button
                            style={{
                                padding: '0.4rem 1.25rem', borderRadius: '30px',
                                background: activeTab === 'live' ? '#6366f1' : 'transparent',
                                color: activeTab === 'live' ? 'white' : '#cbd5e1',
                                fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease'
                            }}
                            onClick={() => setActiveTab('live')}
                        >
                            Live Feed
                        </button>
                    </div>
                </div>
            </div>

            {activeTab === 'mytrips' ? (
                <EmptyState
                    icon={Compass}
                    title="Where will your next adventure take you?"
                    description="You have no upcoming trips. Book a flight, train, or cruise to see your itinerary come to life here."
                    buttonText="Explore Destinations"
                    buttonLink="/"
                    colorHint="rgba(96, 165, 250, 0.2)"
                />
            ) : (
                <>
                    {/* Live tracking badge added here to preserve original layout */}
                    <div className="mb-6 flex justify-end">
                        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid #10b981', color: '#34d399', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginRight: '8px', animation: 'pulse 2s infinite' }}></span>
                            Live Tracking Active
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="card" style={{ height: '220px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '1rem', animation: 'skeletonPulse 1.5s infinite', border: '1px solid rgba(255,255,255,0.05)' }}></div>
                            ))
                        ) : (
                            bookings.map((booking) => (
                                <div key={booking.id} className="card" style={{ padding: '1.5rem', background: 'rgba(30, 41, 59, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                background: 'rgba(255,255,255,0.1)',
                                                color: booking.type === 'Flight' ? '#60a5fa' : booking.type === 'Train' ? '#fb923c' : '#2dd4bf'
                                            }}>
                                                {booking.type}
                                            </span>
                                            <h3 className="text-xl font-bold mt-2">{booking.name}</h3>
                                        </div>
                                        <h2 className="text-xl font-bold" style={{ color: '#818cf8', margin: 0 }}>{booking.price}</h2>
                                    </div>

                                    <div className="flex items-center gap-2 mb-2" style={{ color: '#cbd5e1' }}>
                                        <MapPin size={16} />
                                        <span className="text-sm font-medium">{booking.route}</span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-6" style={{ color: '#cbd5e1' }}>
                                        <Clock size={16} />
                                        <span className="text-sm font-medium">{booking.time}</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div className="flex items-center gap-2">
                                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getStatusColor(booking.status) }}></span>
                                            <span style={{ fontWeight: 'bold', color: getStatusColor(booking.status) }}>{booking.status}</span>
                                        </div>
                                        <button className="btn btn-primary" style={{ padding: '0.4rem 1rem' }} onClick={() => {
                                            if (booking.type === 'Flight') {
                                                localStorage.setItem('bookedFlight', 'rainy');
                                                alert('Flight booked! Check your Home Dashboard for smart recommendations.');
                                            } else {
                                                alert('Ticket Booked!');
                                            }
                                        }}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* Adding basic keyframes inside component for the pulse effect */}
            <style>
                {`
                    @keyframes pulse {
                        0% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.5; transform: scale(1.2); }
                        100% { opacity: 1; transform: scale(1); }
                    }
                    @keyframes skeletonPulse {
                        0% { opacity: 0.4; }
                        50% { opacity: 0.1; }
                        100% { opacity: 0.4; }
                    }
                `}
            </style>
        </div>
    );
};

export default Booking;
