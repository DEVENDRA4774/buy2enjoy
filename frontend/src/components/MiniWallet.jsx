import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ShoppingCart } from 'lucide-react';
import { FiLoader } from 'react-icons/fi';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

const MiniWallet = () => {
    const { cartCount, cartTotal } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Mock balance
    const balance = user?.balance || 1250.00;

    const handleAction = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        navigate('/wallet');
    };

    return (
        <div
            onClick={isLoading ? undefined : handleAction}
            style={{
                position: 'fixed',
                top: '20px',
                right: '25px',
                zIndex: 1000,
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                color: 'white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                transition: 'transform 0.3s ease, opacity 0.3s',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
            }}
            onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.transform = 'scale(1.05)' }}
            onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.transform = 'scale(1)' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isLoading ? <FiLoader className="animate-spin text-white" /> : <Wallet size={18} color="#a78bfa" />}
                <span style={{ fontWeight: 'bold' }}>${balance.toFixed(2)}</span>
            </div>

            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ position: 'relative' }}>
                    <ShoppingCart size={18} color="#60a5fa" />
                    {cartCount > 0 && (
                        <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', fontSize: '10px', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {cartCount}
                        </span>
                    )}
                </div>
                {cartTotal > 0 && <span style={{ fontWeight: 'bold', color: '#cbd5e1', fontSize: '14px' }}>${cartTotal}</span>}
            </div>
        </div>
    );
};

export default MiniWallet;
