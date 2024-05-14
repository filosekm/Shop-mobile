import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react-native';
import fetchMock from 'jest-fetch-mock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../screens/HomeScreen';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
}));

// Mock @env
jest.mock('@env', () => ({
    API_ENDPOINT: 'https://example.com',
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
    const React = require('react');
    const { View } = require('react-native');
    const MockIonicons = (props) => <View {...props} />;
    return {
        Ionicons: MockIonicons,
    };
});

// Mock global functions
global.alert = jest.fn();

// Define setImmediate for the test environment
global.setImmediate = (callback) => setTimeout(callback, 0);

beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
});

describe('HomeScreen', () => {
    test('renders without crashing and shows loading indicator', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([]));

        const { getByTestId } = render(<HomeScreen />);

        expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    test('fetches and renders posts', async () => {
        const posts = [
            { id: 1, title: 'Post 1', content: 'Content 1', createdAt: '2023-01-01', userRating: 4 },
            { id: 2, title: 'Post 2', content: 'Content 2', createdAt: '2023-01-02', userRating: 5 },
        ];

        AsyncStorage.getItem.mockResolvedValueOnce('mock-token'); // Mock user token
        fetchMock.mockResponseOnce(JSON.stringify(posts)); // Mock posts response

        const { getByText, queryByTestId } = render(<HomeScreen />);

        await waitFor(() => {
            expect(queryByTestId('loading-indicator')).toBeNull(); // Loading indicator should disappear
            expect(getByText('Post 1')).toBeTruthy();
            expect(getByText('Post 2')).toBeTruthy();
        });
    });

    test('handles sort options', async () => {
        const posts = [
            { id: 1, title: 'B Post', content: 'Content B', createdAt: '2023-01-01', userRating: 3 },
            { id: 2, title: 'A Post', content: 'Content A', createdAt: '2023-01-02', userRating: 5 },
        ];

        AsyncStorage.getItem.mockResolvedValueOnce('mock-token'); // Mock user token
        fetchMock.mockResponseOnce(JSON.stringify(posts)); // Mock posts response

        const { getByText, getByTestId } = render(<HomeScreen />);

        await waitFor(() => {
            expect(getByText('B Post')).toBeTruthy();
            expect(getByText('A Post')).toBeTruthy();
        });

        // Test sorting by title
        fireEvent.press(getByTestId('sort-title'));

        await waitFor(() => {
            const sortedPosts = getByTestId('post-list').props.data;
            expect(sortedPosts[0].title).toBe('A Post');
            expect(sortedPosts[1].title).toBe('B Post');
        });
    });
});
