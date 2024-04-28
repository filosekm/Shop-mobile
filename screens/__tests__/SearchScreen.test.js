import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SearchScreen from '../screens/SearchScreen';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
    fetch.resetMocks();
});

describe('SearchScreen', () => {
    it('renders search input and button', () => {
        const { getByPlaceholderText, getByText } = render(<SearchScreen />);
        expect(getByPlaceholderText('Wpisz szukane słowo kluczowe...')).toBeTruthy();
        expect(getByText('Szukaj')).toBeTruthy();
    });

    it('performs a search when button is pressed', async () => {
        const testQuery = "test";
        const testResponse = [{ id: 1, title: "Test Post", content: "This is a test" }];

        fetch.mockResponseOnce(JSON.stringify(testResponse));

        const { getByText, getByPlaceholderText, queryByText } = render(<SearchScreen />);
        const searchInput = getByPlaceholderText('Wpisz szukane słowo kluczowe...');
        const searchButton = getByText('Szukaj');

        fireEvent.changeText(searchInput, testQuery);
        fireEvent.press(searchButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(`http://localhost:8080/posts?query=${encodeURIComponent(testQuery)}`);
            expect(queryByText('This is a test')).toBeTruthy();
        });
    });

    it('displays an error message when the fetch fails', async () => {
        fetch.mockReject(new Error('API failure'));

        const { getByText, getByPlaceholderText } = render(<SearchScreen />);
        fireEvent.changeText(getByPlaceholderText('Wpisz szukane słowo kluczowe...'), 'fail');
        fireEvent.press(getByText('Szukaj'));

        await waitFor(() => {
            expect(getByText('No posts found.')).toBeTruthy();
        });
    });

    it('shows loading indicator while searching', async () => {
        fetch.mockResponseOnce(() => new Promise(resolve => setTimeout(() => resolve({ json: () => [] }), 100)));

        const { getByText, queryByTestId } = render(<SearchScreen />);
        fireEvent.press(getByText('Szukaj'));

        expect(queryByTestId('activity-indicator')).toBeTruthy();

        await waitFor(() => {
            expect(queryByTestId('activity-indicator')).toBeFalsy();
        });
    });
});
