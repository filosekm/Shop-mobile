import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

jest.mock('../screens/AppNavigator', () => () => <></>);
jest.mock('../context/AuthContext', () => ({
    AuthProvider: ({ children }) => <>{children}</>,
}));

describe('App', () => {
    beforeEach(() => {
        Notifications.getPermissionsAsync.mockResolvedValue({ status: 'granted' });
        Notifications.requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
        Notifications.getExpoPushTokenAsync.mockResolvedValue({ data: 'test-push-token' });
        AsyncStorage.setItem.mockClear();
        global.alert.mockClear();
        global.console.log.mockClear();
    });

    test('registers for push notifications on mount', async () => {
        render(<App />);

        await waitFor(() => {
            expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
            expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalled();
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('pushToken', 'test-push-token');
        });
    });

    test('requests permissions if not already granted', async () => {
        Notifications.getPermissionsAsync.mockResolvedValueOnce({ status: 'undetermined' });

        render(<App />);

        await waitFor(() => {
            expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
            expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalled();
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('pushToken', 'test-push-token');
        });
    });

    test('handles permission denied case', async () => {
        Notifications.getPermissionsAsync.mockResolvedValueOnce({ status: 'undetermined' });
        Notifications.requestPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });

        render(<App />);

        await waitFor(() => {
            expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
            expect(AsyncStorage.setItem).not.toHaveBeenCalled();
            expect(global.alert).toHaveBeenCalledWith('Failed to get push token for push notification!');
        });
    });

    test('handles error in storing push token', async () => {
        AsyncStorage.setItem.mockRejectedValueOnce(new Error('Failed to save token'));

        render(<App />);

        await waitFor(() => {
            expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalled();
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('pushToken', 'test-push-token');
        });

        // Optionally, you can check if the error was logged
        expect(global.console.log).toHaveBeenCalledWith('Error saving push token: ', new Error('Failed to save token'));
    });
});
