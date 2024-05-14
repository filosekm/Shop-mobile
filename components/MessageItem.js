import React from 'react';
import { View, Text } from 'react-native';
import styles from "../styles/MessageItemStyles"; // Ensure correct import path

const MessageItem = ({ message }) => {
    return (

        <View style={styles.messageCard}>
            <Text style={styles.messageSubject}>{message.subject}</Text>
            <Text style={styles.messageContent}>{message.message}</Text>
        </View>
    );
};

export default MessageItem;
