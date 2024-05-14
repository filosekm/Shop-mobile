import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import MessageScreen from '../screens/MessageScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve('token')),
    setItem: jest.fn(),
}));

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
            { id: '1', userID: '123', sender: 'Alice', message: 'Specific message text' }
        ])
    })
);

describe('MessageScreen', () => {
    beforeEach(() => {
        AsyncStorage.getItem.mockResolvedValue('123'); // Assuming 'userID' is also fetched
        fetch.mockClear();
    });

    it('renders messages correctly', async () => {
        const { findByText } = render(<MessageScreen />);
        await waitFor(() => {
            const messageText = findByText('Specific message text');
            expect(messageText).toBeTruthy();
        });
    }, 10000); // 10 seconds timeout
});
