import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavoritesScreen from '../screens/FavoritesScreen'; // Assuming the file is one level up
import fetchMock from 'jest-fetch-mock';
import { View } from 'react-native';

// Mock @rneui/themed components
jest.mock('@rneui/themed', () => {
    const React = require('react');
    const { View } = require('react-native');
    const MockInput = (props) => <View {...props} />;
    const MockButton = (props) => <View {...props} />;
    return {
        Input: MockInput,
        Button: MockButton,
        Icon: (props) => <View {...props} />,
    };
});

// Set up mock for AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

// Configure fetch-mock
beforeEach(() => {
    fetchMock.resetMocks();
});

describe('FavoritesScreen', () => {
    test('renders correctly with no favorite posts', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(null);

        const { getByText } = render(<FavoritesScreen />);

        await waitFor(() => {
            expect(getByText('Brak ulubionych wpisów.')).toBeTruthy();
        });
    });

    test('renders favorite posts correctly', async () => {
        const favoritePostsData = [
            { id: '1', title: 'Post 1', content: 'Content 1' },
            { id: '2', title: 'Post 2', content: 'Content 2' },
        ];

        AsyncStorage.getItem.mockImplementation((key) => {
            if (key === 'favorites') {
                return JSON.stringify(['1', '2']);
            } else if (key === 'userToken') {
                return 'dummyToken';
            }
            return null;
        });

        fetchMock.mockResponses(
            [JSON.stringify(favoritePostsData[0]), { status: 200 }],
            [JSON.stringify(favoritePostsData[1]), { status: 200 }]
        );

        const { getByText } = render(<FavoritesScreen />);

        await waitFor(() => {
            expect(getByText('Post 1')).toBeTruthy();
            expect(getByText('Content 1')).toBeTruthy();
            expect(getByText('Post 2')).toBeTruthy();
            expect(getByText('Content 2')).toBeTruthy();
        });
    });

    test('displays error message on fetch failure', async () => {
        AsyncStorage.getItem.mockImplementation((key) => {
            if (key === 'favorites') {
                return JSON.stringify(['1']);
            } else if (key === 'userToken') {
                return 'dummyToken';
            }
            return null;
        });

        fetchMock.mockReject(new Error('Failed to fetch'));

        const { getByText } = render(<FavoritesScreen />);

        await waitFor(() => {
            expect(getByText('Brak ulubionych wpisów.')).toBeTruthy();
        });
    });

    test('refresh functionality', async () => {
        const favoritePostsData = [
            { id: '1', title: 'Post 1', content: 'Content 1' },
        ];

        AsyncStorage.getItem.mockImplementation((key) => {
            if (key === 'favorites') {
                return JSON.stringify(['1']);
            } else if (key === 'userToken') {
                return 'dummyToken';
            }
            return null;
        });

        fetchMock.mockResponseOnce(JSON.stringify(favoritePostsData[0]), { status: 200 });

        const { getByTestId, getByText } = render(<FavoritesScreen />);

        await waitFor(() => {
            expect(getByText('Post 1')).toBeTruthy();
            expect(getByText('Content 1')).toBeTruthy();
        });

        // Trigger the pull-to-refresh
        fireEvent(getByTestId('favoritesList'), 'refresh');

        await waitFor(() => {
            expect(fetchMock.mock.calls.length).toBeGreaterThan(1);
        });
    });
});
