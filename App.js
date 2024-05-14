import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './screens/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    async function registerForPushNotificationsAsync() {
        let token;
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;

        await storeToken(token);
        return token;
    }

    async function storeToken(token) {
        try {
            await AsyncStorage.setItem('pushToken', token);
        } catch (error) {
            console.log("Error saving push token: ", error);
        }
    }


    return (
        <AuthProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
}
