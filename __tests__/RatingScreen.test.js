import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RatingScreen from '../screens/RatingScreen';
import { API_ENDPOINT } from "@env";
import fetchMock from 'jest-fetch-mock';

// Mock @env
jest.mock('@env', () => ({
    API_ENDPOINT: 'https://example.com',
}));

// Mock fetch
fetchMock.enableMocks();

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

beforeEach(() => {
    fetchMock.resetMocks();
    AsyncStorage.getItem.mockClear();
});

describe('RatingScreen', () => {
    const mockPosts = [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' },
    ];

    const mockRatings1 = [
        { score: 4 },
        { score: 5 },
    ];

    const mockRatings2 = [
        { score: 3 },
        { score: 4 },
    ];

    const mockToken = 'mock-token';

    test('renders correctly and shows loading indicator', () => {
        AsyncStorage.getItem.mockResolvedValueOnce(mockToken);
        fetchMock.mockResponseOnce(JSON.stringify(mockPosts));

        const { getByText } = render(<RatingScreen />);

        expect(getByText('Loading...')).toBeTruthy();
    });

    test('fetches and displays posts with average ratings', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(mockToken);
        fetchMock.mockResponses(
            [JSON.stringify(mockPosts), { status: 200 }],
            [JSON.stringify(mockRatings1), { status: 200 }],
            [JSON.stringify(mockRatings2), { status: 200 }],
        );

        const { getByText } = render(<RatingScreen />);

        await waitFor(() => {
            expect(getByText('Post ID: 1')).toBeTruthy();
            expect(getByText('Post Title: Post 1')).toBeTruthy();
            expect(getByText('Average Rating: 4.5')).toBeTruthy();

            expect(getByText('Post ID: 2')).toBeTruthy();
            expect(getByText('Post Title: Post 2')).toBeTruthy();
            expect(getByText('Average Rating: 3.5')).toBeTruthy();
        });
    });
});
