import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getUsers, setAdminStatus } from '../services/userService';
import NavigationButtons from '../components/NavigationButtons';
import UserItem from '../components/UserItem';
import styles from '../styles/AdminPanelStyles';

const AdminPanel = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const { isAdmin } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            if (data) {
                setUsers(data);
            } else {
                console.error('No user data received');
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
    };

    const handleSetAdmin = async (userId) => {
        try {
            const result = await setAdminStatus(userId);
            if (result.success) {
                Alert.alert('Success', result.message);
                fetchUsers();
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            console.error('Error setting admin status:', error);
            Alert.alert('Error', 'Failed to set admin status');
        }
    };

    const renderUserItem = ({ item }) => (
        <UserItem
            user={item}
            isAdmin={isAdmin}
            onSetAdmin={handleSetAdmin}
        />
    );

    const keyExtractor = (item) => (item.id ? item.id.toString() : Math.random().toString());

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Użytkownicy:</Text>
            <FlatList
                data={users}
                keyExtractor={keyExtractor}
                renderItem={renderUserItem}
            />
            <NavigationButtons navigation={navigation} />
        </View>
    );
};

export default AdminPanel;
