import React from 'react';
import { Text, StyleSheet } from 'react-native';

const ErrorMessage = () => (
    <Text style={styles.errorMessage}>No posts available.</Text>
);

const styles = StyleSheet.create({
    errorMessage: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});

export default ErrorMessage;
