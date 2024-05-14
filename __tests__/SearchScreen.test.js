import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SearchScreen from '../screens/SearchScreen';
import { API_ENDPOINT } from "@env";
import fetchMock from 'jest-fetch-mock';
import { Text, View } from 'react-native';

// Mock @env
jest.mock('@env', () => ({
    API_ENDPOINT: 'https://example.com',
}));

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

// Mock fetch
fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
});

describe('SearchScreen', () => {
    const mockPosts = [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' },
    ];

    let originalConsoleError;

    beforeAll(() => {
        // Save the original console.error method
        originalConsoleError = console.error;
        // Mock console.error to silence the logs during tests
        console.error = jest.fn();
    });

    afterAll(() => {
        // Restore the original console.error method
        console.error = originalConsoleError;
    });

    test('renders correctly and displays search input, button, and loading indicator', () => {
        const { getByPlaceholderText, getByText } = render(<SearchScreen />);

        expect(getByPlaceholderText('Wpisz szukane słowo kluczowe...')).toBeTruthy();
        expect(getByText('Search')).toBeTruthy();
    });

    test('handles search and displays search results', async () => {
        fetchMock.mockResponseOnce(JSON.stringify(mockPosts));

        const { getByPlaceholderText, getByText, getByTestId, queryByText } = render(<SearchScreen />);

        fireEvent.changeText(getByPlaceholderText('Wpisz szukane słowo kluczowe...'), 'test query');
        fireEvent.press(getByText('Search'));

        expect(getByTestId('activity-indicator')).toBeTruthy();

        await waitFor(() => {
            expect(queryByText('Loading...')).toBeNull();
            expect(getByText('Post 1')).toBeTruthy();
            expect(getByText('Content 1')).toBeTruthy();
            expect(getByText('Post 2')).toBeTruthy();
            expect(getByText('Content 2')).toBeTruthy();
        });
    });

    test('displays "No posts found" message when there are no search results', async () => {
        fetchMock.mockResponseOnce(JSON.stringify([]));

        const { getByPlaceholderText, getByText, queryByText } = render(<SearchScreen />);

        fireEvent.changeText(getByPlaceholderText('Wpisz szukane słowo kluczowe...'), 'test query');
        fireEvent.press(getByText('Search'));

        await waitFor(() => {
            expect(queryByText('No posts found.')).toBeTruthy();
        });
    });

    test('handles search errors gracefully', async () => {
        fetchMock.mockReject(new Error('Search failed'));

        const { getByPlaceholderText, getByText, queryByText } = render(<SearchScreen />);

        fireEvent.changeText(getByPlaceholderText('Wpisz szukane słowo kluczowe...'), 'test query');
        fireEvent.press(getByText('Search'));

        await waitFor(() => {
            expect(queryByText('No posts found.')).toBeTruthy();
        });
    });
});
