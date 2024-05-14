import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PostItem = ({ item, navigateToPostDetails, favorites, addToFavorites, removeFromFavorites }) => (
    <TouchableOpacity onPress={() => navigateToPostDetails(item.id)}>
        <View style={styles.postCard}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.content}>{item.content}</Text>
            {item.userRating !== null ? (
                <Text style={styles.rating}>Your rating: {item.userRating}</Text>
            ) : (
                <Text style={styles.rating}>Not Rated Yet</Text>
            )}
            <Ionicons
                name={favorites.includes(item.id) ? "heart" : "heart-outline"}
                size={24}
                color="red"
                onPress={() => favorites.includes(item.id) ? removeFromFavorites(item.id) : addToFavorites(item.id)}
            />
        </View>
    </TouchableOpacity>
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
        color:'white',
    },
    content:{
        marginTop: 10,
        fontSize: 15,
        color:'white',
    },
    rating: {
        marginTop: 10,
        marginBottom:10,
        fontSize: 16,
        color: 'lightgray'
    },
});

export default PostItem;
