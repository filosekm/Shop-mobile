import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINT } from "@env";

export const getUsers = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API_ENDPOINT}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Failed to fetch users:', error);
    }
    return null;
};

export const setAdminStatus = async (userId) => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API_ENDPOINT}/users/${userId}/set_admin`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return {
            success: response.ok,
            message: data.message || 'An error occurred',
        };
    } catch (error) {
        console.error('Failed to set admin:', error);
        return {
            success: false,
            message: error.message,
        };
    }
};
