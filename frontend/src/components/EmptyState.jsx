import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon: Icon, title, description, buttonText, buttonLink, colorHint = 'rgba(99, 102, 241, 0.2)' }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            textAlign: 'center',
            boxShadow: `0 15px 35px rgba(0,0,0,0.3), inset 0 0 40px ${colorHint}`,
            pointerEvents: 'auto'
        }}>
            {Icon && (
                <div style={{
                    background: colorHint,
                    padding: '24px',
                    borderRadius: '50%',
                    marginBottom: '1.5rem',
                    boxShadow: `0 0 30px ${colorHint}`
                }}>
                    <Icon size={64} style={{ color: 'white', opacity: 0.9 }} />
                </div>
            )}
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {title}
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.15rem', maxWidth: '500px', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                {description}
            </p>
            {buttonText && buttonLink && (
                <Link to={buttonLink} className="btn" style={{
                    background: '#6366f1',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(99, 102, 241, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.4)';
                    }}>
                    {buttonText}
                </Link>
            )}
        </div>
    );
};

export default EmptyState;
