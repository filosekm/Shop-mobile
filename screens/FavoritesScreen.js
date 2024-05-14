import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { getFavorites, fetchFavoritePosts } from '../services/favoritesService';
import FavoritePost from '../components/FavoritePost';
import styles from '../styles/FavoritesScreenStyles';

const FavoritesScreen = () => {
    const [favorites, setFavorites] = useState([]);
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadFavorites();
    }, [refreshing]);

    useEffect(() => {
        if (favorites.length > 0) {
            fetchFavoritePosts(favorites).then(posts => {
                setFavoritePosts(posts);
            });
        } else {
            setFavoritePosts([]);
        }
    }, [favorites]);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshing(true);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const loadFavorites = async () => {
        try {
            const favs = await getFavorites();
            setFavorites(favs);
        } catch (error) {
            Alert.alert("Error", "Failed to load favorites.");
        } finally {
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ulubione Wpisy</Text>
            {favoritePosts.length > 0 ? (
                <FlatList
                    data={favoritePosts}
                    renderItem={({ item }) => <FavoritePost post={item} />}
                    keyExtractor={(item) => item.id?.toString() || item.toString()}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    testID="favoritesList"
                />
            ) : (
                <Text style={styles.errorMessage}>Brak ulubionych wpisów.</Text>
            )}
        </View>
    );
};

export default FavoritesScreen;
