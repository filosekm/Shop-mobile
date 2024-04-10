// screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HomeScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Witaj w Aplikacji Blogowej!</Text>
            <View style={styles.card}>
                <Text style={styles.cardText}>Najnowsze Wpisy</Text>
            </View>
            {/* Można tutaj dodać listę wpisów */}
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    cardText: {
        fontSize: 18,
    },
});

export default HomeScreen;
