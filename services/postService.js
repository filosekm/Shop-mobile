import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINT } from '@env';
import { getAuthToken, getPushToken } from './authService';

export const createPost = async (title, content) => {
    const payload = { title, content };

    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_ENDPOINT}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to create post');
        }

        return responseData.message;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

export const sendPushNotification = async () => {
    try {
        const token = await getPushToken();
        if (!token) {
            console.error('Token not found');
            return;
        }

        const message = {
            to: token,
            sound: 'default',
            title: 'Dodano nowy post',
            body: 'Sprawdź najnowsze posty!',
            data: { someData: 'goes here' },
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};

export const deletePost = async (postId) => {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_ENDPOINT}/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.message || 'Failed to delete post');
        }
    } catch (error) {
        console.error('Failed to delete post:', error);
        throw error;
    }
};

export const fetchPosts = async () => {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_ENDPOINT}/posts`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const postsData = await response.json();
            return postsData; // Ensure you return the fetched posts data
        } else {
            console.error('Error response status:', response.status);
            throw new Error(`Failed to fetch posts: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const fetchComments = async (postId) => {
    try {
        const token = await getAuthToken();
        const response = await fetch(`${API_ENDPOINT}/posts/${postId}/comments`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to fetch comments');
        }
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const fetchUserRating = async (postId) => {
    try {
        const storedRating = await AsyncStorage.getItem(`rating_${postId}`);
        if (storedRating) {
            return parseFloat(storedRating);
        }

        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API_ENDPOINT}/posts/${postId}/ratings`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const rating = await response.json();
            await AsyncStorage.setItem(`rating_${postId}`, rating.score.toString()); // Store rating in AsyncStorage
            return rating.score; // Ensure this matches your API response structure
        } else {
            const errorText = await response.text();
            throw new Error('Failed to fetch user rating');
        }
    } catch (error) {
        return null; // Return null if there's an error fetching the rating
    }
};
