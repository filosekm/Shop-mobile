import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/posts?query=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Search failed:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FlatList
            data={posts}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.postCard}>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <Text>{item.content}</Text>
                </View>
            )}
            ListHeaderComponent={
                <>
                    <Text style={styles.title}>  Wyszukiwarka</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Wpisz szukane słowo kluczowe..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Button title="Szukaj" onPress={handleSearch} />
                    {loading && <ActivityIndicator size="large" color="#0000ff" />}
                </>
            }
            ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
            ListEmptyComponent={!loading && <Text>  No posts found.</Text>}
        />
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
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 8,
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

export default SearchScreen;
