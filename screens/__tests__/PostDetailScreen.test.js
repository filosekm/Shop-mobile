import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PostDetailScreen from '../screens/PostDetailScreen';

// Mock fetch globally
global.fetch = jest.fn();

// Reset fetch mock before each test
beforeEach(() => {
    fetch.mockClear();
});

describe('PostDetailScreen', () => {
    const route = {
        params: {
            postId: '1',  // Example post ID
        },
    };

    it('displays loading indicator while fetching the post', () => {
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({
                title: "Test Post",
                content: "This is a test post",
                comments: [],
            }),
        });

        const { getByTestId } = render(<PostDetailScreen route={route} />);
        expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('renders post details and comments after fetching', async () => {
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({
                title: "Test Post",
                content: "This is a test post",
                comments: [{ id: '1', content: 'Great post!' }],
            }),
        });

        const { getByText } = render(<PostDetailScreen route={route} />);

        await waitFor(() => {
            expect(getByText('Test Post')).toBeTruthy();
            expect(getByText('This is a test post')).toBeTruthy();
            expect(getByText('Great post!')).toBeTruthy();
        });
    });

    it('handles new comment submission', async () => {
        // Initial fetch for post
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({
                title: "Test Post",
                content: "This is a test post",
                comments: [],
            }),
        });

        // Fetch mock for submitting comment
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(),
        });

        // Second fetch to reload comments
        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({
                title: "Test Post",
                content: "This is a test post",
                comments: [{ id: '1', content: 'Great post!' }],
            }),
        });

        const { getByPlaceholderText, getByText } = render(<PostDetailScreen route={route} />);

        await waitFor(() => {
            fireEvent.changeText(getByPlaceholderText('Add a comment...'), 'Great post!');
            fireEvent.press(getByText('Submit Comment'));
        });

        // Verify that comments are reloaded after submission
        await waitFor(() => {
            expect(getByText('Great post!')).toBeTruthy();
        });
    });

    it('shows an error if fetching the post fails', async () => {
        fetch.mockRejectedValue(new Error('Failed to fetch'));

        const { getByText } = render(<PostDetailScreen route={route} />);

        await waitFor(() => {
            expect(getByText('Failed to fetch post')).toBeTruthy();
        });
    });
});
