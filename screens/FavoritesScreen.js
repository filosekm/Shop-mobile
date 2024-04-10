// screens/FavoritesScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const FavoritesScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Ulubione Wpisy</Text>
            {/* Tutaj można dodać listę ulubionych wpisów */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    // Styl `container` i `title` może pozostać taki sam jak w HomeScreen
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default FavoritesScreen;
