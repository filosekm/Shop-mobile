import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FavoritePost = ({ post }) => (
    <View style={styles.postCard}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.content}>{post.content}</Text>
    </View>
);

const styles = StyleSheet.create({
    postCard: {
        backgroundColor: '#424242',
        padding: 20,
        borderRadius: 5,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 1.22,
        elevation: 3,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        marginTop: 10,
        fontSize: 15,
        color: 'white',
    },
});

export default FavoritePost;
