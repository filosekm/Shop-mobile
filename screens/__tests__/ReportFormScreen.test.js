import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ReportFormScreen from '../screens/ReportFormScreen';
import { Alert } from 'react-native';

// Mock fetch and alert
global.fetch = require('jest-fetch-mock');
jest.mock('react-native/Libraries/Alert/Alert');

describe('ReportFormScreen', () => {
    beforeEach(() => {
        fetch.resetMocks();
        Alert.alert.mockClear();
    });

    it('alerts the user if form fields are empty upon submission', () => {
        const { getByText } = render(<ReportFormScreen />);
        const sendButton = getByText('Wyślij');
        fireEvent.press(sendButton);
        expect(Alert.alert).toHaveBeenCalledWith("Błąd", "Proszę wypełnić wszystkie pola.");
    });

    it('sends data when form is correctly filled and handles server response', async () => {
        fetch.mockResponseOnce(JSON.stringify({ status: 'success' }), { status: 200 });

        const { getByText, getByPlaceholderText } = render(<ReportFormScreen />);
        fireEvent.changeText(getByPlaceholderText('Imię:'), 'John');
        fireEvent.changeText(getByPlaceholderText('Email:'), 'john@example.com');
        fireEvent.changeText(getByPlaceholderText('Opis:'), 'Just a test');
        // Simulate Picker value change
        // Assuming you have a function to simulate picker change

        const sendButton = getByText('Wyślij');
        fireEvent.press(sendButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    title: 'Zgłoszenie od John',
                    description: 'Email: john@example.com\n\nJust a test'
                })
            }));
            expect(Alert.alert).toHaveBeenCalledWith("Zgłoszenie wysłane", "Dziękujemy za Twoje zgłoszenie.");
        });
    });

    it('handles server errors correctly', async () => {
        fetch.mockReject(new Error('Failed to connect'));

        const { getByText } = render(<ReportFormScreen />);
        fireEvent.changeText(getByPlaceholderText('Imię:'), 'John');
        fireEvent.changeText(getByPlaceholderText('Email:'), 'john@example.com');
        fireEvent.changeText(getByPlaceholderText('Opis:'), 'Just a test');
        const sendButton = getByText('Wyślij');
        fireEvent.press(sendButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Błąd", "Nie udało się wysłać zgłoszenia, spróbuj ponownie.");
        });
    });
});
