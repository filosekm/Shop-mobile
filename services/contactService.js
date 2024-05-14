import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINT } from '@env';

export const sendMessage = async (subject, message) => {
    const payload = {
        subject,
        message
    };

    try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API_ENDPOINT}/contact_author`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload)
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to send message');
        }

        return responseData.message;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const fetchContactMessages = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API_ENDPOINT}/contact_messages`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to fetch contact messages');
        }
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        throw error;
    }
};
