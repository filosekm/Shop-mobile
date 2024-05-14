import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Button } from '@rneui/themed';
import { API_ENDPOINT } from "@env";

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [allPosts, setAllPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_ENDPOINT}/posts`);
            if (response.ok) {
                const data = await response.json();
                setAllPosts(data);
                setFilteredPosts(data);
            } else {
                console.error('Failed to fetch posts:', response.status);
                const errorText = await response.text();
                console.error('Error response:', errorText);
                setAllPosts([]);
                setFilteredPosts([]);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setAllPosts([]);
            setFilteredPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            setFilteredPosts(allPosts);
        } else {
            const filteredData = allPosts.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPosts(filteredData);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredPosts}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.postCard}>
                        <Text style={styles.postTitle}>{item.title}</Text>
                        <Text style={styles.content}>{item.content}</Text>
                    </View>
                )}
                ListHeaderComponent={
                    <>
                        <Text style={styles.title}>Wyszukiwarka</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Wpisz szukane słowo kluczowe..."
                            placeholderTextColor='white'
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <Button
                            title="Search"
                            onPress={handleSearch}
                            buttonStyle={styles.buttonStyle}
                            containerStyle={styles.buttonContainer2}
                        />
                        {loading && <ActivityIndicator size="large" color="#0000ff" testID="activity-indicator" />}
                    </>
                }
                ListEmptyComponent={!loading && <Text style={styles.content}>No posts found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#303030',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    content: {
        color: 'white',
    },
    input: {
        fontSize: 18,
        backgroundColor: '#424242',
        borderColor: '#212121',
        padding: 10,
        marginBottom: 20,
        borderRadius: 8,
        width: '100%',
        color: 'white',
    },
    postCard: {
        padding: 15,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 1.22,
        elevation: 3,
        backgroundColor: '#424242',
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    buttonContainer2: {
        width: '100%',
    },
    buttonStyle: {
        borderColor: '#424242',
        backgroundColor: '#434343',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
});

export default SearchScreen;
