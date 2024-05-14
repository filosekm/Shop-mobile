import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINT } from "@env";

const RatingScreen = ({ navigation }) => {
    const [postsData, setPostsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_ENDPOINT}/posts`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const posts = await response.json();
                const ratedPosts = await Promise.all(posts.map(async (post) => {
                    return fetchAverageRating(post, token);
                }));
                setPostsData(ratedPosts);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setLoading(false);
        }
    };

    const fetchAverageRating = async (post, token) => {
        try {
            const response = await fetch(`https://bd73-82-139-13-67.ngrok-free.app/posts/${post.id}/ratings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const ratings = await response.json();
                if (ratings.length > 0) {
                    const totalRating = ratings.reduce((acc, rating) => {
                        if (typeof rating.score !== 'number') {
                            console.error('Invalid rating value:', rating.score);
                            return acc;
                        }
                        return acc + rating.score;
                    }, 0);
                    const averageRating = totalRating / ratings.length;
                    return { ...post, averageRating };
                } else {
                    return { ...post, averageRating: "No ratings" };
                }
            }
        } catch (error) {
            console.error('Error fetching ratings for post:', post.id, error);
            return { ...post, averageRating: "Error fetching ratings" };
        }
    };

    const handlePress = (postId) => {
        if (navigation) {
            navigation.navigate('PostDetailScreen', { postId });
        } else {
            console.warn('Navigation object is not defined');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {postsData.map(post => (
                <TouchableOpacity key={post.id} style={styles.card} onPress={() => handlePress(post.id)}>
                    <Text style={styles.content}>{`Post ID: ${post.id}`}</Text>
                    <Text style={styles.content}>{`Post Title: ${post.title}`}</Text>
                    <Text style={styles.content}>{`Average Rating: ${post.averageRating}`}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#303030',
    },
    card: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#212121',
        elevation: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    content: {
        color: 'white',
        fontSize: 16,
    },
});

export default RatingScreen;
