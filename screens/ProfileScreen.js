import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

const ProfileScreen = ({ navigation }) => {
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/logout', {
                method: 'GET', // or POST if your server requires
                headers: {
                    'Content-Type': 'application/json',
                    // Include credentials and tokens if needed
                },
            });

            if (response.ok) {
                console.log('Wylogowano');
                Alert.alert("Logged Out", "You have been successfully logged out.");
                navigation.navigate('LoginScreen'); // Redirect to the login screen or wherever appropriate
            } else {
                throw new Error('Failed to logout');
            }
        } catch (error) {
            console.error('Logout failed:', error);
            Alert.alert("Error", "Logout failed, please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil Użytkownika</Text>
            {/* Information about the user could be added here */}
            <Button title="Wyloguj" onPress={handleLogout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default ProfileScreen;
