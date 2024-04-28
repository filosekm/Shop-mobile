import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesScreen = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const favs = await AsyncStorage.getItem('favorites');
            if (favs !== null) {
                // Assuming favs is stored as an array of post IDs
                setFavorites(JSON.parse(favs));
            }
        } catch (error) {
            Alert.alert("Error", "Failed to load favorites.");
        }
    };

    const renderFavoriteItem = ({ item }) => (
        <View style={styles.postCard}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text>{item.content}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Ulubione Wpisy</Text>
            <FlatList
                data={favorites}
                keyExtractor={item => item.id.toString()}
                renderItem={renderFavoriteItem}
            />
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
});

export default FavoritesScreen;
