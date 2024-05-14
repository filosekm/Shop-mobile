import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { decode as atob } from 'base-64';
import { API_ENDPOINT } from '@env';
export const AuthContext = createContext({
    isLoggedIn: false,
    isAdmin: false,
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        checkToken();
        const interval = setInterval(() => {
            checkAdminRole();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const checkToken = async () => {
        try {
            global.atob = atob;
            const token = await AsyncStorage.getItem('userToken')
            const decodedToken = jwtDecode(token);
            const sub = decodedToken.sub;
            if (token) {
                setIsLoggedIn(true);
                fetchUserInfo(token);
            } else {
                setIsLoggedIn(false);
                setIsAdmin(false);
            }
        } catch (e) {
        }
    };

    const login = async (token) => {
        try {
            await AsyncStorage.setItem(`userToken`, token.toString());
            checkToken()
            setIsLoggedIn(true);
        } catch (e) {
            console.error('Failed to store token:', e);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            setIsLoggedIn(false);
        } catch (e) {
            console.error('Failed to remove token:', e);
        }
    };

    const fetchUserInfo = async (token) => {
        try {
            const email = await AsyncStorage.getItem('userEmail');
            if (!email) {
                console.error('No email found in AsyncStorage');
                return;
            }

            const response = await fetch(`${API_ENDPOINT}/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                const currentUser = userData.find(user => user.email === email && user.is_admin === true);
                if (currentUser) {
                    setIsAdmin(true);
                    await AsyncStorage.setItem('userName', currentUser.username);
                } else {
                    setIsAdmin(false);
                }
            } else {
                console.error('Failed to fetch user info:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch user info:', error);
        }
    };

    const checkAdminRole = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                fetchUserInfo(token);
            }
        } catch (error) {
            console.error('Failed to check admin role:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
