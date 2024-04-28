import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import FavoritesScreen from '../screens/FavoritesScreen';
import { Alert } from 'react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('FavoritesScreen', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        AsyncStorage.getItem.mockClear();
        Alert.alert.mockClear();
    });

    it('loads favorites on component mount', async () => {
        const mockFavorites = JSON.stringify([{ id: 1, title: 'Post 1', content: 'Content 1' }]);
        AsyncStorage.getItem.mockResolvedValue(mockFavorites);

        const { getByText } = render(<FavoritesScreen />);

        await waitFor(() => {
            expect(AsyncStorage.getItem).toHaveBeenCalledWith('favorites');
            expect(getByText('Post 1')).toBeTruthy();
            expect(getByText('Content 1')).toBeTruthy();
        });
    });

    it('handles absence of favorites gracefully', async () => {
        AsyncStorage.getItem.mockResolvedValue(null);

        const { getByText } = render(<FavoritesScreen />);

        await waitFor(() => {
            expect(AsyncStorage.getItem).toHaveBeenCalledWith('favorites');
            expect(getByText('Ulubione Wpisy')).toBeTruthy(); // Only static text is displayed
        });
    });

    it('displays an error if loading favorites fails', async () => {
        AsyncStorage.getItem.mockRejectedValue(new Error('Failed to load'));

        render(<FavoritesScreen />);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Error", "Failed to load favorites.");
        });
    });
});
