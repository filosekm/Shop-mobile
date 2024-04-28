import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

// Mock fetch globally
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([
            { id: 1, title: 'Post 1', content: 'Content for post 1' },
            { id: 2, title: 'Post 2', content: 'Content for post 2' },
        ]),
    })
);

describe('HomeScreen', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('renders the loading indicator initially', () => {
        const { getByTestId } = render(<HomeScreen />);
        expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('fetches and displays posts', async () => {
        const { getByText, queryByTestId } = render(<HomeScreen />);

        await waitFor(() => {
            expect(queryByTestId('loading-indicator')).toBeFalsy();
            expect(getByText('Post 1')).toBeTruthy();
            expect(getByText('Content for post 1')).toBeTruthy();
            expect(getByText('Post 2')).toBeTruthy();
            expect(getByText('Content for post 2')).toBeTruthy();
        });
    });

    it('handles fetch error', async () => {
        fetch.mockImplementationOnce(() => Promise.reject('API is down'));

        const { getByText, queryByTestId } = render(<HomeScreen />);

        await waitFor(() => {
            expect(queryByTestId('loading-indicator')).toBeFalsy();
            expect(getByText('Failed to fetch posts')).toBeTruthy();
        });
    });
});
