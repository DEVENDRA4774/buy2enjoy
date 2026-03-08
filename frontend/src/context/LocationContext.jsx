/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState({
        country: 'Loading...',
        city: 'Loading...',
        coordinates: null,
        weather: 'loading',
        temperature: null
    });

    useEffect(() => {
        const fetchWeatherWithCoords = async (latitude, longitude, cityFallback, countryFallback) => {
            try {
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                const weatherData = await weatherRes.json();

                const temp = weatherData.current_weather.temperature;
                const weatherCode = weatherData.current_weather.weathercode;

                let condition = 'clear';
                if (temp > 35) {
                    condition = 'heatwave';
                } else if ([51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weatherCode)) {
                    condition = 'rain';
                }

                let finalCity = cityFallback;
                let finalCountry = countryFallback;

                if (!cityFallback || cityFallback === 'Unknown') {
                    try {
                        const reverseGeoReq = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                        const reverseGeoData = await reverseGeoReq.json();
                        finalCity = reverseGeoData.city || reverseGeoData.locality || 'Unknown';
                        finalCountry = reverseGeoData.countryName || 'Unknown';
                    } catch (e) {
                        console.error("Reverse geocoding failed", e);
                    }
                }

                setLocation({
                    country: finalCountry,
                    city: finalCity,
                    coordinates: { lat: latitude, lng: longitude },
                    weather: condition,
                    temperature: temp
                });
            } catch (error) {
                console.error("Error fetching weather data:", error);
                setLocation({
                    country: countryFallback || 'India',
                    city: cityFallback || 'Pune',
                    coordinates: { lat: latitude, lng: longitude },
                    weather: 'clear',
                    temperature: null
                });
            }
        };

        const fetchIpLocation = async () => {
            try {
                const geoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
                const geoData = await geoRes.json();
                if (geoData.latitude && geoData.longitude) {
                    await fetchWeatherWithCoords(geoData.latitude, geoData.longitude, geoData.city, geoData.country);
                } else {
                    throw new Error("Invalid IP geo data");
                }
            } catch (e) {
                console.error("IP Geolocation failed", e);
                fetchWeatherWithCoords(18.5204, 73.8567, 'Pune', 'India');
            }
        };

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => setTimeout(() => fetchWeatherWithCoords(position.coords.latitude, position.coords.longitude, '', ''), 500),
                (error) => {
                    console.warn("Browser geolocation denied/failed", error);
                    fetchIpLocation();
                },
                { timeout: 10000 }
            );
        } else {
            fetchIpLocation();
        }
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
