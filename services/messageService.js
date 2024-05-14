import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINT } from '@env';

export const fetchMessages = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const userID = await AsyncStorage.getItem('userID');
        const response = await fetch(`${API_ENDPOINT}/contact_messages`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        return Array.isArray(data) ? data.filter(message => message.userID === userID) : [];
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};
