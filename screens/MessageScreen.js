import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { fetchContactMessages } from '../services/contactService'; // Ensure the correct import path
import MessageItem from '../components/MessageItem';
import styles from '../styles/MessagesScreenStyles';

const MessagesScreen = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadMessages();
        setRefreshing(false);
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        setLoading(true);
        setError('');
        try {
            const messages = await fetchContactMessages();
            setMessages(messages);
        } catch (error) {
            setError('Unable to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#ffffff" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={messages}
                    renderItem={({ item, index }) => <MessageItem message={item} />}
                    keyExtractor={(item, index) => `${item.id}-${index}`} // Combine id and index to ensure uniqueness
                    ListEmptyComponent={<Text style={styles.emptyMessage}>No messages found.</Text>}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#ffffff"]}
                        />
                    }
                />
            )}
        </View>
    );
};

export default MessagesScreen;
