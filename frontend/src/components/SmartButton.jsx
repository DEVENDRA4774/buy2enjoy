import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';

const SmartButton = ({ label, icon, destination, customClass = "", onClickOverride, textClass = "font-medium text-white", hoverClass = "hover:bg-white/10" }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleAction = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 1. Turn on the loading state
        setIsLoading(true);

        // 2. Simulate a 1.5-second network request or secure connection
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 3. Turn off loading and execute override or navigate
        setIsLoading(false);
        if (onClickOverride) {
            onClickOverride(e);
        } else if (destination) {
            navigate(destination);
        }
    };

    return (
        <button
            onClick={handleAction}
            disabled={isLoading}
            className={`flex items-center gap-2 rounded transition-all duration-300 ${customClass} ${isLoading ? 'opacity-70 cursor-not-allowed' : hoverClass}`}
            style={{ border: 'none', outline: 'none', background: 'transparent' }}
        >
            {/* Show a spinning icon if loading, otherwise show the normal icon */}
            {isLoading ? (
                <FiLoader className="animate-spin text-primary" />
            ) : (icon &&
                <span className="flex items-center justify-center">{icon}</span>
            )}

            {/* The Button Text */}
            <span className={textClass}>{label}</span>
        </button>
    );
};

export default SmartButton;
