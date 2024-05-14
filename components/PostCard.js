import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/PostCardStyles';

const PostCard = ({ item, navigateToPostDetails, favorites, addToFavorites, removeFromFavorites }) => (
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
                testID={`favorite-${item.id}`}
            />
        </View>
    </TouchableOpacity>
);

export default PostCard;
