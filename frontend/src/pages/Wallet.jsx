import React from 'react';
import EmptyState from '../components/EmptyState';
import { Wallet } from 'lucide-react';

const WalletPage = () => {
    return (
        <div style={{ pointerEvents: 'auto', paddingTop: '2rem', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <h1 className="text-3xl font-bold mb-6" style={{ color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                Universal Wallet
            </h1>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmptyState
                    icon={Wallet}
                    title="Ready to earn as you spend?"
                    description="Every purchase, booking, and appointment earns you loyalty points. Link a payment method to unlock your first reward."
                    buttonText="Link Payment Method"
                    buttonLink="/"
                    colorHint="rgba(167, 139, 250, 0.2)"
                />
            </div>
        </div>
    );
};

export default WalletPage;
