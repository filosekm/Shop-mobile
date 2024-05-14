import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@rneui/themed';
import styles from '../styles/AdminPanelStyles';

const UserItem = ({ user, isAdmin, onSetAdmin }) => (
    <View style={styles.user}>
        <Text style={styles.userName}>{user.username} (Admin: {user.is_admin ? 'Yes' : 'No'})</Text>
        {!user.is_admin && isAdmin && (
            <Button title="Make Admin" onPress={() => onSetAdmin(user.id)} />
        )}
    </View>
);

export default UserItem;
