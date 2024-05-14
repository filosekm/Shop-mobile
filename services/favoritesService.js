import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINT } from '@env';
import { getAuthToken } from './authService';

export const getFavorites = async () => {
    try {
        const favs = await AsyncStorage.getItem('favorites');
        return favs ? JSON.parse(favs) : [];
    } catch (error) {
        console.error('Error loading favorites:', error);
        throw error;
    }
};

export const fetchFavoritePosts = async (favorites) => {
    try {
        const token = await getAuthToken();
        const favoritePosts = await Promise.all(favorites.map(async (postId) => {
            const response = await fetch(`${API_ENDPOINT}/posts/${postId}`, {
                method:'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const postData = await response.json();
            return postData;
        }));
        return favoritePosts;
    } catch (error) {
        console.error('Error fetching favorite posts:', error);
        return [];
    }
};
