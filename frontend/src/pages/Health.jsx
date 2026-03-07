import React from 'react';
import EmptyState from '../components/EmptyState';
import { Stethoscope } from 'lucide-react';

const Health = () => {
    return (
        <div style={{ pointerEvents: 'auto', paddingTop: '2rem', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <h1 className="text-3xl font-bold mb-6" style={{ color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                My Health Portal
            </h1>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmptyState
                    icon={Stethoscope}
                    title="Your health journey starts here."
                    description="Securely book your first online consultation or sync your history to keep your medical life organized."
                    buttonText="Find a Doctor"
                    buttonLink="/"
                    colorHint="rgba(52, 211, 153, 0.2)"
                />
            </div>
        </div>
    );
};

export default Health;
