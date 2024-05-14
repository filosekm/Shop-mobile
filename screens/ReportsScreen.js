import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINT } from '@env'; // Ensure this is correctly configured

const ReportsScreen = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const response = await fetch(`${API_ENDPOINT}/issues`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator testID="loading-indicator" size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemTitle} testID="testid">{item.title}</Text>
                            <Text style={styles.itemDescription}>{item.description}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#303030',
        padding: 16,
    },
    itemContainer: {
        backgroundColor: '#424242',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    itemTitle: {
        color: '#ffffff',
        fontSize: 18,
        marginBottom: 4,
    },
    itemDescription: {
        color: '#b0b0b0',
        fontSize: 14,
    },
});

export default ReportsScreen;
