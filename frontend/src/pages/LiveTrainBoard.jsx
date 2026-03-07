import React, { useState, useEffect } from 'react';

// 1. Initial Train Data
const initialTrainData = [
    { id: 'EXP-404', route: 'Pune ➔ Mumbai', time: '10:30 AM', platform: '4', status: 'On Time' },
    { id: 'AC-992', route: 'New York ➔ Washington DC', time: '10:45 AM', platform: '9', status: 'Boarding' },
    { id: 'BUL-001', route: 'Tokyo ➔ Osaka', time: '11:15 AM', platform: '1', status: 'Delayed' },
    { id: 'RGL-774', route: 'London ➔ Paris', time: '12:00 PM', platform: '3', status: 'Scheduled' }
];

const LiveTrainBoard = () => {
    const [trains, setTrains] = useState(initialTrainData);

    // 2. The "Live Heartbeat" Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setTrains((currentTrains) => {
                // Pick a random train to update
                const randomIndex = Math.floor(Math.random() * currentTrains.length);
                const newTrains = [...currentTrains];

                // Cycle through statuses to simulate real movement
                const statuses = ['On Time', 'Boarding', 'Departed', 'Delayed'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

                newTrains[randomIndex].status = randomStatus;
                return newTrains;
            });
        }, 5000); // Updates every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Helper function to color-code statuses
    const getStatusColor = (status) => {
        switch (status) {
            case 'On Time': return 'text-green-400';
            case 'Boarding': return 'text-blue-400 animate-pulse';
            case 'Departed': return 'text-gray-400';
            case 'Delayed': return 'text-red-400 font-bold';
            default: return 'text-white';
        }
    };

    return (
        <div className="min-h-screen text-white p-8" style={{ position: 'relative', zIndex: 10 }}>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">🚆 Live Express Trains</h1>
                <p className="text-gray-400">Real-time tracking and platform updates.</p>
            </div>

            {/* The Glassmorphism Train Board */}
            <div style={{
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }} className="p-6">

                {/* Table Headers */}
                <div className="grid grid-cols-5 gap-4 border-b border-white/20 pb-3 mb-4 text-sm text-gray-400 font-semibold uppercase tracking-wider">
                    <div>Train ID</div>
                    <div className="col-span-2">Route</div>
                    <div>Departure</div>
                    <div>Status</div>
                </div>

                {/* Live Train Rows */}
                <div className="flex flex-col gap-4">
                    {trains.map((train) => (
                        <div key={train.id} className="grid grid-cols-5 gap-4 items-center bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10 shadow-md">
                            <div className="font-mono font-bold text-[#c084fc]">{train.id}</div>
                            <div className="col-span-2 font-medium">{train.route}</div>
                            <div className="text-gray-300">
                                {train.time} <span className="text-xs text-gray-400 ml-2 border border-gray-600 px-2 py-0.5 rounded">Plat {train.platform}</span>
                            </div>
                            <div className={`${getStatusColor(train.status)} font-medium`}>
                                {train.status}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default LiveTrainBoard;
