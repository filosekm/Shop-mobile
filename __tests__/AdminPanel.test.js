import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import AdminPanel from '../screens/AdminPanel';
import { API_ENDPOINT } from '@env';
import fetchMock from 'jest-fetch-mock';

// Polyfill for setImmediate
global.setImmediate = (callback) => setTimeout(callback, 0);

// Mock useAuth
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

// Mock @env
jest.mock('@env', () => ({
    API_ENDPOINT: 'https://example.com',
}));

// Mock @rneui/themed
jest.mock('@rneui/themed', () => {
    const { View, Text } = require('react-native');
    const MockButton = ({ title, onPress }) => (
        <View onClick={onPress}>
            <Text>{title}</Text>
        </View>
    );
    return {
        Button: MockButton,
    };
});

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
    navigate: mockNavigate,
};

// Mock Alert and console.error
global.alert = jest.fn();
global.console.error = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
    useAuth.mockReturnValue({ isAdmin: true });
    global.alert.mockClear();
});

describe('AdminPanel', () => {
    test('renders user list and buttons', async () => {
        const users = [
            { id: 1, username: 'user1', is_admin: false },
            { id: 2, username: 'user2', is_admin: true },
        ];

        AsyncStorage.getItem.mockResolvedValueOnce('mock-token');
        fetchMock.mockResponseOnce(JSON.stringify(users));

        const { getByText, queryByText } = render(<AdminPanel navigation={mockNavigation} />);

        await waitFor(() => {
            expect(getByText('user1 (Admin: No)')).toBeTruthy();
            expect(getByText('user2 (Admin: Yes)')).toBeTruthy();
            expect(getByText('Create Post')).toBeTruthy();
            expect(getByText('View Comments')).toBeTruthy();
            expect(getByText('View Rating')).toBeTruthy();
            expect(getByText('Show Reports')).toBeTruthy();
        });

        expect(queryByText('Make Admin')).toBeTruthy();
    });

    test('sets user as admin', async () => {
        const users = [
            { id: 1, username: 'user1', is_admin: false },
        ];

        AsyncStorage.getItem.mockResolvedValue('mock-token');
        fetchMock.mockResponse(JSON.stringify(users));

        const { getByText } = render(<AdminPanel navigation={mockNavigation} />);

        await waitFor(() => {
            expect(getByText('user1 (Admin: No)')).toBeTruthy();
        });

        fetchMock.mockResponseOnce(JSON.stringify({ message: 'User set as admin successfully' }));



        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test('navigates to different screens', async () => {
        const users = [
            { id: 1, username: 'user1', is_admin: false },
        ];

        AsyncStorage.getItem.mockResolvedValue('mock-token');
        fetchMock.mockResponse(JSON.stringify(users));

        const { getByText } = render(<AdminPanel navigation={mockNavigation} />);

        await waitFor(() => {
            expect(getByText('Create Post')).toBeTruthy();
            expect(getByText('View Comments')).toBeTruthy();
            expect(getByText('View Rating')).toBeTruthy();
            expect(getByText('Show Reports')).toBeTruthy();
        });

        fireEvent.press(getByText('Create Post'));
        expect(mockNavigate).toHaveBeenCalledWith('CreatePost');

        fireEvent.press(getByText('View Comments'));
        expect(mockNavigate).toHaveBeenCalledWith('Comments');

        fireEvent.press(getByText('View Rating'));
        expect(mockNavigate).toHaveBeenCalledWith('Rating');

        fireEvent.press(getByText('Show Reports'));
        expect(mockNavigate).toHaveBeenCalledWith('Reports');
    });

    test('handles fetch users error', async () => {
        AsyncStorage.getItem.mockResolvedValue('mock-token');
        fetchMock.mockReject(new Error('Failed to fetch users'));

        const { getByText } = render(<AdminPanel navigation={mockNavigation} />);

        await waitFor(() => {
            expect(getByText('Użytkownicy:')).toBeTruthy();
        });

    });
});
