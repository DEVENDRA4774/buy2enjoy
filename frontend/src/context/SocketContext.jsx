import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import AuthContext from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        // Only connect if user is logged in
        if (user) {
            const newSocket = io(window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/', {
                query: { userId: user._id, isAdmin: user.isAdmin }
            });

            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Socket Connected');
            });

            return () => newSocket.close();
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
