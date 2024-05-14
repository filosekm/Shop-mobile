import { API_ENDPOINT } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthToken = async () => {
    try {
        return await AsyncStorage.getItem('userToken');
    } catch (error) {
        console.error('Error getting auth token:', error);
        throw error;
    }
};

export const getPushToken = async () => {
    try {
        return await AsyncStorage.getItem('pushToken');
    } catch (error) {
        console.error('Error getting push token:', error);
        throw error;
    }
};
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_ENDPOINT}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (!response.ok) {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.message || 'Login failed');
        }

        const data = JSON.parse(responseText);
        return data.access_token;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};
