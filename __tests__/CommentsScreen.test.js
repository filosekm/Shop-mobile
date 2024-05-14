import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommentsScreen from '../screens/CommentsScreen';
import { API_ENDPOINT } from '@env';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
}));

jest.mock('@env', () => ({
    API_ENDPOINT: 'https://example.com'
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

beforeEach(() => {
    jest.clearAllMocks();
    fetch.resetMocks();
});


test('fetches and renders posts', async () => {
    const posts = [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' },
    ];

    AsyncStorage.getItem.mockResolvedValue('mock-token');
    fetch.mockResponseOnce(JSON.stringify(posts));

    const { getByText, queryByText } = render(<CommentsScreen />);

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(`https://bd73-82-139-13-67.ngrok-free.app//posts`, expect.anything()));

    expect(queryByText('Loading...')).toBeNull();
    expect(getByText('Post 1')).toBeTruthy();
    expect(getByText('Post 2')).toBeTruthy();
});

test('handles toggle comments', async () => {
    const posts = [
        { id: 1, title: 'Post 1' },
    ];
    const comments = [
        { id: 1, content: 'Comment 1' },
        { id: 2, content: 'Comment 2' },
    ];

    AsyncStorage.getItem.mockResolvedValue('mock-token');
    fetch.mockResponseOnce(JSON.stringify(posts));
    fetch.mockResponseOnce(JSON.stringify(comments));

    const { getByText, queryByText } = render(<CommentsScreen />);

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(`https://bd73-82-139-13-67.ngrok-free.app//posts`, expect.anything()));

    fireEvent.press(getByText('Post 1'));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(`https://bd73-82-139-13-67.ngrok-free.app//posts/1/comments`, expect.anything()));

    expect(getByText('Comment 1')).toBeTruthy();
    expect(getByText('Comment 2')).toBeTruthy();

    fireEvent.press(getByText('Post 1'));

    await waitFor(() => {
        expect(queryByText('Comment 1')).toBeNull();
        expect(queryByText('Comment 2')).toBeNull();
    });
});


