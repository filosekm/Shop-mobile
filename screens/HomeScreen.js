import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { fetchPosts, fetchUserRating } from '../services/postService';
import SortOption from '../components/SortOption';
import PostCard from '../components/PostCard';
import styles from '../styles/HomeScreenStyles';

const HomeScreen = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState('date');
    const [sortDirection, setSortDirection] = useState('asc');
    const [favorites, setFavorites] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        fetchInitialData();
        const interval = setInterval(() => {
            fetchInitialData();
        }, 60000);
        return () => clearInterval(interval);
    }, [refreshing]);

    const fetchInitialData = async () => {
        await fetchPostsData();
        await fetchFavoritesData();
        setRefreshing(false);
    };

    const fetchPostsData = async () => {
        try {
            const postsData = await fetchPosts();
            const postsWithRatings = await Promise.all(postsData.map(async (post) => {
                const userRating = await fetchUserRating(post.id);
                return { ...post, userRating };
            }));
            setPosts(postsWithRatings);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Failed to fetch posts');
        }
    };

    const fetchFavoritesData = async () => {
        try {
            const favs = await AsyncStorage.getItem('favorites');
            setFavorites(favs ? JSON.parse(favs) : []);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch favorites');
        }
    };

    const addToFavorites = async (postId) => {
        try {
            if (!favorites.includes(postId)) {
                const updatedFavorites = [...favorites, postId];
                setFavorites(updatedFavorites);
                await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                Alert.alert("Success", "Post added to favorites!");
            } else {
                Alert.alert("Info", "Post already in favorites.");
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to add to favorites.');
        }
    };

    const removeFromFavorites = async (postId) => {
        try {
            const updatedFavorites = favorites.filter(id => id !== postId);
            setFavorites(updatedFavorites);
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            Alert.alert("Success", "Post removed from favorites!");
        } catch (error) {
            Alert.alert('Error', 'Failed to remove from favorites.');
        }
    };

    const navigateToPostDetails = (postId) => {
        if (navigation) {
            navigation.navigate('PostDetailScreen', { postId });
        } else {
            console.warn("Navigation object not initialized yet.");
        }
    };

    const sortByOption = (option) => {
        if (option === sortOption) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortOption(option);
            setSortDirection('asc');
        }

        let sortedPosts = [...posts];
        switch (option) {
            case 'rating':
                sortedPosts.sort((a, b) => {
                    const aRating = a.userRating || 0;
                    const bRating = b.userRating || 0;
                    return sortDirection === 'asc' ? aRating - bRating : bRating - aRating;
                });
                break;
            case 'title':
                sortedPosts.sort((a, b) => sortDirection === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
                break;
            default:
                sortedPosts.sort((a, b) => {
                    const aDate = new Date(a.createdAt);
                    const bDate = new Date(b.createdAt);
                    return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
                });
                break;
        }
        setPosts(sortedPosts);
    };

    const onRefresh = () => {
        setRefreshing(true);
    };

    const sortOptions = [
        { label: 'Sort by Date', value: 'date' },
        { label: 'Sort by Rating', value: 'rating' },
        { label: 'Sort by Title', value: 'title' },
    ];

    const LoadingIndicator = () => (
        <View style={styles.loadingContainer} testID="loading-indicator">
            <ActivityIndicator size="large" color="#00ff00" />
        </View>
    );

    const ErrorMessage = () => (
        <Text style={styles.errorMessage}>No posts available.</Text>
    );

    const NavigationWarning = () => (
        <Text style={styles.warning}>Navigation object not initialized yet.</Text>
    );

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.sort}
                data={sortOptions}
                renderItem={({ item }) => <SortOption item={item} sortOption={sortOption} sortByOption={sortByOption} />}
                keyExtractor={(item) => item.value}
                horizontal
                showsHorizontalScrollIndicator={false}
                testID="sort-options"
            />
            {loading ? (
                <LoadingIndicator />
            ) : posts.length > 0 ? (
                <FlatList
                    style={styles.content}
                    data={posts}
                    renderItem={({ item }) => (
                        <PostCard
                            item={item}
                            navigateToPostDetails={navigateToPostDetails}
                            favorites={favorites}
                            addToFavorites={addToFavorites}
                            removeFromFavorites={removeFromFavorites}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    testID="post-list"
                />
            ) : (
                <ErrorMessage />
            )}
            {!navigation && <NavigationWarning />}
        </View>
    );
};

export default HomeScreen;
