import React, { createContext, useState, useEffect, useContext } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState({
        country: 'Loading...',
        city: 'Loading...',
        coordinates: null,
        weather: 'loading'
    });

    useEffect(() => {
        // Mock geolocation detection that happens when user loads site
        const timer = setTimeout(() => {
            // Randomize weather for demo purposes
            const mockWeathers = ['rain', 'heatwave', 'clear'];
            const randomWeather = mockWeathers[Math.floor(Math.random() * mockWeathers.length)];

            setLocation({
                country: 'India',
                city: 'Pune',
                coordinates: { lat: 18.5204, lng: 73.8567 },
                weather: randomWeather
            });
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const updateLocation = (newLoc) => {
        setLocation(newLoc);
    };

    return (
        <LocationContext.Provider value={{ location, updateLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
export default LocationContext;
