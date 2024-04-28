import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const HomeScreen = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:8080/posts');
            const data = await response.json();
            setPosts(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Welcome to the Blog App!</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                posts.map((post, index) => (
                    <View key={index} style={styles.postCard}>
                        <Text style={styles.postTitle}>{post.title}</Text>
                        <Text>{post.content}</Text>
                        {/* Display the average rating if available */}
                        <Text style={styles.rating}>
                            {post.averageRating ? `Rating: ${post.averageRating.toFixed(1)} / 5` : "Not rated yet"}
                        </Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    postCard: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 1.22,
        elevation: 3,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    rating: {
        marginTop: 10,
        fontSize: 14,
        color: 'darkgray'
    },
});

export default HomeScreen;
