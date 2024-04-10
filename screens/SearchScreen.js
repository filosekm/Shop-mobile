// screens/SearchScreen.js
import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';

const SearchScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Wyszukiwarka</Text>
            <TextInput style={styles.input} placeholder="Wpisz szukane słowo kluczowe..." />
            <Button title="Szukaj" onPress={() => console.log('Rozpocznij wyszukiwanie')} />
            {/* Wyniki wyszukiwania */}
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
    input: {
        fontSize: 18,
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 20,
        borderRadius: 8,
    },
});

export default SearchScreen;
