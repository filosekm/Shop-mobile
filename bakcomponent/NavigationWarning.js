import React from 'react';
import { Text, StyleSheet } from 'react-native';

const NavigationWarning = () => (
    <Text style={styles.warning}>Navigation object not initialized yet.</Text>
);

const styles = StyleSheet.create({
    warning: {
        fontSize: 16,
        color: 'orange',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default NavigationWarning;
