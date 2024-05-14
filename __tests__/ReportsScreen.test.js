// ReportsScreen.test.js

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ReportsScreen from '../screens/ReportsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
    console.error.mockRestore();
    console.warn.mockRestore();
});

describe('ReportsScreen', () => {
    const mockReports = [
        { id: 1, title: 'Report 1', description: 'Description 1' },
        { id: 2, title: 'Report 2', description: 'Description 2' },
    ];

    const mockToken = 'mock-token';

    test('renders correctly and shows loading indicator', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(mockToken);
        fetchMock.mockResponseOnce(JSON.stringify([]));

        const { getByTestId } = render(<ReportsScreen />);

        expect(getByTestId('loading-indicator')).toBeTruthy();  // Corrected testID here
    });

    test('fetches and displays reports', async () => {
        AsyncStorage.getItem.mockResolvedValueOnce(mockToken);
        fetchMock.mockResponseOnce(JSON.stringify(mockReports));

        const { getByText, queryByText } = render(<ReportsScreen />);

        await waitFor(() => {
            expect(queryByText('Loading...')).toBeNull();
            expect(getByText('Report 1')).toBeTruthy();
            expect(getByText('Description 1')).toBeTruthy();
            expect(getByText('Report 2')).toBeTruthy();
            expect(getByText('Description 2')).toBeTruthy();
        });
    });
});
