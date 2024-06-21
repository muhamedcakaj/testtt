import React, { createContext, useEffect, useRef } from 'react';
import { refreshToken as fetchNewTokens } from './axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const intervalRef = useRef(null);

    const startTokenRefresh = () => {
        intervalRef.current = setInterval(async () => {
            try {
                const refreshToken = sessionStorage.getItem('refreshToken');
                if (refreshToken) {
                    console.log("Attempting to refresh token...");
                    const newTokens = await fetchNewTokens(refreshToken);
                    sessionStorage.setItem('jwtToken', newTokens.token);
                    sessionStorage.setItem('refreshToken', newTokens.refresh_token);
                    console.log("Tokens after refresh:");
                    console.log("New Token:", newTokens.token);
                    console.log("New Refresh Token:", newTokens.refresh_token);
                } else {
                    clearInterval(intervalRef.current); // Stop the interval if there's no refresh token
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
                clearInterval(intervalRef.current); // Stop the interval on error
            }
        }, 60 * 1000); // 1 minute interval
    };

    useEffect(() => {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (refreshToken) {
            startTokenRefresh();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);